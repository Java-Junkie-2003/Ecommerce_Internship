// Mock các module y như được require trong repo
jest.mock('../models/product.model', () => ({
  product: {
    find: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock('../models/brand.model', () => ({
  findOne: jest.fn(),
}));

jest.mock('../utils', () => ({
  getSelectData: (arr) => {
    if (!Array.isArray(arr)) return {};
    return arr.reduce((o, k) => (o[k] = 1, o), {});
  },
  getUnSelectData: (arr) => {
    if (!Array.isArray(arr)) return {};
    return arr.reduce((o, k) => (o[k] = 0, o), {});
  },
  convertToObjectId: (v) => v,
  ensureArray: (v) => (Array.isArray(v) ? v : [v]),
  normalizeGender: (g) => (typeof g === 'string' ? g.trim() : g),
}));

jest.mock('../models/repositories/inventory.repo', () => ({
  findInvenByProductId: jest.fn(),
}));

jest.mock('../core/error.response', () => {
  class NotFoundError extends Error { }
  class BadRequestError extends Error { }
  return { NotFoundError, BadRequestError };
});

const mongoose = require('mongoose');
const { product } = require('../models/product.model');
const brandModel = require('../models/brand.model');
const { findInvenByProductId } = require('../models/repositories/inventory.repo');
const { NotFoundError, BadRequestError } = require('../core/error.response');

// Module đang test
const repo = require('../models/repositories/product.repo');

afterEach(() => {
  jest.clearAllMocks();
});

//
// findAllProducts
//
describe('findAllProducts', () => {
  it('trả về danh sách sản phẩm với sort/skip/limit/select/lean', async () => {
    const mockLean = jest.fn().mockResolvedValue(['p1', 'p2']);
    const mockSelect = jest.fn(() => ({ lean: mockLean }));
    const mockLimit = jest.fn(() => ({ select: mockSelect }));
    const mockSkip = jest.fn(() => ({ limit: mockLimit }));
    const mockSort = jest.fn(() => ({ skip: mockSkip }));
    product.find.mockReturnValue({ sort: mockSort });

    const res = await repo.findAllProducts({
      limit: 2,
      sort: 'ctime',
      page: 1,
      filter: { isPublished: true },
      select: ['a', 'b'],
    });

    expect(product.find).toHaveBeenCalledWith({ isPublished: true });
    expect(res).toEqual(['p1', 'p2']);
  });
});

//
// findProduct
//
describe('findProduct', () => {
  it('populate & select đúng, trả về document', async () => {
    const mockSelect = jest.fn().mockResolvedValue({ _id: 'x' });
    const mockPopulate2 = jest.fn(() => ({ select: mockSelect }));
    const mockPopulate1 = jest.fn(() => ({ populate: mockPopulate2 }));
    product.findById.mockReturnValue({ populate: mockPopulate1 });

    const res = await repo.findProduct({ product_id: 'id1', unSelect: ['__v'] });
    expect(product.findById).toHaveBeenCalledWith('id1');
    expect(res).toEqual({ _id: 'x' });
  });
});

//
// findAllDraftsForShop
//
describe('findAllDraftsForShop', () => {
  it('trả về danh sách draft có populate/skip/limit/lean', async () => {
    const exec = jest.fn().mockResolvedValue(['d1', 'd2']);
    const lean = jest.fn(() => ({ exec }));
    const limit = jest.fn(() => ({ lean }));
    const skip = jest.fn(() => ({ limit }));
    const populate2 = jest.fn(() => ({ skip }));
    const populate1 = jest.fn(() => ({ populate: populate2 }));
    product.find.mockReturnValue({ populate: populate1 });

    const res = await repo.findAllDraftsForShop({ query: { isDraft: true }, limit: 2, skip: 0 });
    expect(product.find).toHaveBeenCalledWith({ isDraft: true });
    expect(res).toEqual(['d1', 'd2']);
  });
});

//
// findAllProductByCategory
//
describe('findAllProductByCategory', () => {
  it('lọc theo category filter và phân trang', async () => {
    const lean = jest.fn().mockResolvedValue(['c1']);
    const select = jest.fn(() => ({ lean }));
    const limit = jest.fn(() => ({ select }));
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    product.find.mockReturnValue({ sort });

    const res = await repo.findAllProductByCategory({
      limit: 1, sort: '-ctime', page: 2, filter: { product_categories: 'cat1' }, select: ['x'],
    });

    expect(product.find).toHaveBeenCalledWith({ product_categories: 'cat1' });
    expect(res).toEqual(['c1']);
  });
});

//
// findAllProductByBrand (aggregation)
//
describe('findAllProductByBrand', () => {
  it('aggregate pipeline theo brand_name và isPublished', async () => {
    const exec = jest.fn().mockResolvedValue(['b1', 'b2']);
    const option = jest.fn(() => ({ exec }));
    const allowDiskUse = jest.fn(() => ({ option }));
    product.aggregate.mockReturnValue({ allowDiskUse });

    const res = await repo.findAllProductByBrand({
      brand_name: 'Acme',
      limit: 10,
      sort: '-ctime',
      page: 1,
      select: ['_id', 'product_name'],
    });

    expect(product.aggregate).toHaveBeenCalled();
    expect(res).toEqual(['b1', 'b2']);
  });
});

//
// publishProductByAdmin
//
describe('publishProductByAdmin', () => {
  it('trả về null nếu ObjectId không hợp lệ', async () => {
    const r = await repo.publishProductByAdmin({ product_id: 'bad-id' });
    expect(r).toBeNull();
  });

  it('trả về null nếu không tìm thấy product', async () => {
    product.findById.mockResolvedValue(null);
    const r = await repo.publishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' });
    expect(r).toBeNull();
  });

  it('trả về 0 nếu đã published & không draft', async () => {
    product.findById.mockResolvedValue({ isPublished: true, isDraft: false });
    const r = await repo.publishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' });
    expect(r).toBe(0);
  });

  it('throw NotFoundError nếu brand không tồn tại', async () => {
    product.findById.mockResolvedValue({
      isPublished: false,
      isDraft: true,
      product_brand: '68be511f453c53ec09212d3b',
      set: jest.fn(),
      save: jest.fn(),
    });
    brandModel.findOne.mockResolvedValue(null);

    await expect(
      repo.publishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' })
    ).rejects.toThrow(NotFoundError);
  });

  it('throw BadRequestError nếu brand isPublished = false', async () => {
    product.findById.mockResolvedValue({
      isPublished: false,
      isDraft: true,
      product_brand: '68be511f453c53ec09212d3b',
      set: jest.fn(),
      save: jest.fn(),
    });
    brandModel.findOne.mockResolvedValue({ _id: '68be511f453c53ec09212d3b', isPublished: false });

    await expect(
      repo.publishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' })
    ).rejects.toThrow(BadRequestError);
  });

  it('set isPublished=true, isDraft=false và trả về 1 khi hợp lệ', async () => {
    const set = jest.fn();
    const save = jest.fn();
    product.findById.mockResolvedValue({
      isPublished: false, isDraft: true, product_brand: '68be511f453c53ec09212d3b', set, save,
    });
    brandModel.findOne.mockResolvedValue({ _id: '68be511f453c53ec09212d3b', isPublished: true });

    const r = await repo.publishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' });
    expect(set).toHaveBeenCalledWith({ isPublished: true, isDraft: false });
    expect(save).toHaveBeenCalled();
    expect(r).toBe(1);
  });
});

//
// unPublishProductByAdmin
//
describe('unPublishProductByAdmin', () => {
  it('return null nếu id không hợp lệ', async () => {
    const r = await repo.unPublishProductByAdmin({ product_id: 'bad' });
    expect(r).toBeNull();
  });

  it('return null nếu không có doc', async () => {
    product.findById.mockResolvedValue(null);
    const r = await repo.unPublishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' });
    expect(r).toBeNull();
  });

  it('set isPublished=false, isDraft=true và trả về 1', async () => {
    const set = jest.fn();
    const save = jest.fn();
    product.findById.mockResolvedValue({ set, save });

    const r = await repo.unPublishProductByAdmin({ product_id: '68be511f453c53ec09212d3b' });
    expect(set).toHaveBeenCalledWith({ isPublished: false, isDraft: true });
    expect(save).toHaveBeenCalled();
    expect(r).toBe(1);
  });
});

//
// findAllProductsForAdmin
//
describe('findAllProductsForAdmin', () => {
  it('trả về products + pagination chuẩn', async () => {
    const productsLean = [{ _id: 1 }, { _id: 2 }];
    const lean = jest.fn().mockResolvedValue(productsLean);
    const select = jest.fn(() => ({ lean }));
    const limit = jest.fn(() => ({ select }));
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    const populate2 = jest.fn(() => ({ sort }));
    const populate1 = jest.fn(() => ({ populate: populate2 }));
    product.find.mockReturnValue({ populate: populate1 });

    product.countDocuments.mockResolvedValue(12);

    const res = await repo.findAllProductsForAdmin({
      limit: 5, sort: 'ctime', page: 2, filter: { isPublished: true }, select: ['_id'],
    });

    expect(res.products).toEqual(productsLean);
    expect(res.pagination.totalProduct).toBe(12);
    expect(res.pagination.totalPages).toBe(3);
    expect(res.pagination.page).toBe(2);
    expect(res.pagination.hasNext).toBe(true);
    expect(res.pagination.hasPrev).toBe(true);
  });
});

//
// findProductsByPriceRange
//
describe('findProductsByPriceRange', () => {
  it('lọc theo khoảng giá và phân trang', async () => {
    const lean = jest.fn().mockResolvedValue([{ _id: 'p' }]);
    const select = jest.fn(() => ({ lean }));
    const limit = jest.fn(() => ({ select }));
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    const populate2 = jest.fn(() => ({ sort }));
    const populate1 = jest.fn(() => ({ populate: populate2 }));
    product.find.mockReturnValue({ populate: populate1 });

    const res = await repo.findProductsByPriceRange({
      minPrice: 10, maxPrice: 20, limit: 2, page: 1, sort: '-ctime', select: ['_id'],
    });

    expect(product.find).toHaveBeenCalledWith(
      { product_price: { $gte: 10, $lte: 20 } }
    );
    expect(res).toEqual([{ _id: 'p' }]);
  });
});

//
// updateProductById
//
describe('updateProductById', () => {
  it('gọi model.findByIdAndUpdate với new=true mặc định', async () => {
    const model = { findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: 'u' }) };
    const res = await repo.updateProductById({
      productId: 'id', bodyUpdate: { a: 1 }, model,
    });
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith('id', { a: 1 }, { new: true });
    expect(res).toEqual({ _id: 'u' });
  });
});

//
// checkProductByServer
//
describe('checkProductByServer', () => {
  it('ném NotFoundError nếu không có inventory', async () => {
    const mockSelect = jest.fn().mockResolvedValue({ _id: 'p1', product_price: 99 });
    const mockPopulate2 = jest.fn(() => ({ select: mockSelect }));
    const mockPopulate1 = jest.fn(() => ({ populate: mockPopulate2 }));
    product.findById.mockReturnValue({ populate: mockPopulate1 });
    findInvenByProductId.mockResolvedValue(null);

    await expect(repo.checkProductByServer([{ productId: 'p1', quantity: 1 }]))
      .rejects.toThrow(NotFoundError);
    expect(product.findById).toHaveBeenCalledWith('p1');
    expect(findInvenByProductId).toHaveBeenCalledWith({ productId: 'p1' });
  });

  it('ném BadRequestError nếu quantity > inven_stock', async () => {
    const mockSelect = jest.fn().mockResolvedValue({ _id: 'p1', product_price: 99 });
    const mockPopulate2 = jest.fn(() => ({ select: mockSelect }));
    const mockPopulate1 = jest.fn(() => ({ populate: mockPopulate2 }));
    product.findById.mockReturnValue({ populate: mockPopulate1 });

    // inventory có stock = 2
    findInvenByProductId.mockResolvedValue({ inven_stock: 2 });

    await expect(
      repo.checkProductByServer([{ productId: 'p1', quantity: 3 }])
    ).rejects.toThrow(BadRequestError);
  });

  it('trả về mảng {price, quantity, productId} khi hợp lệ', async () => {
    const mockSelect = jest.fn().mockResolvedValue({ _id: 'p1', product_price: 99 });
    const mockPopulate2 = jest.fn(() => ({ select: mockSelect }));
    const mockPopulate1 = jest.fn(() => ({ populate: mockPopulate2 }));
    product.findById.mockReturnValue({ populate: mockPopulate1 });

    findInvenByProductId.mockResolvedValue({ inven_stock: 10 });

    const out = await repo.checkProductByServer([{ productId: 'p1', quantity: 2 }]);
    expect(out).toEqual([{ price: 99, quantity: 2, productId: 'p1' }]);
  });
});

//
// filterProduct
//
describe('filterProduct', () => {
  afterEach(() => jest.clearAllMocks());

  it('trả về rỗng nếu brand_name không tồn tại', async () => {
    // Mock findOne → .select().lean() trả về null
    const leanNone = jest.fn().mockResolvedValue(null);
    brandModel.findOne.mockReturnValue({
      select: () => ({ lean: leanNone, exec: leanNone })
    });

    const res = await repo.filterProduct({ brand_name: 'NoBrand' });

    // Tùy repo bạn trả về shape nào, dưới đây bao trùm 2 khả năng
    expect(res.products ?? res.results ?? res).toEqual([]);
    expect(res.pagination.totalResult).toBe(0);
  });

  it('lọc theo nhiều điều kiện + phân trang + countDocuments', async () => {
    const leanBrand = jest.fn().mockResolvedValue({ _id: 'b1' });
    brandModel.findOne.mockReturnValue({
      select: () => ({ lean: leanBrand, exec: leanBrand })
    });


    const execList = jest.fn().mockResolvedValue([{ _id: 'p1' }]);
    const leanList = jest.fn(() => ({ exec: execList }));
    const limit = jest.fn(() => ({ lean: leanList }));
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    const populate2 = jest.fn(() => ({ sort }));
    const populate1 = jest.fn(() => ({ populate: populate2 }));
    product.find.mockReturnValue({ populate: populate1 });

    product.countDocuments.mockResolvedValue(6);

    const res = await repo.filterProduct({
      key_search: 'cologne',
      brand_name: 'Acme',
      categoryIds: ['c1', 'c2'],
      minPrice: 10,
      maxPrice: 99,
      gender: ['Male', 'Female'],
      isPublished: true,
      page: 2,
      limit: 2,
      sort: '-price',
      productType: 'Perfume',
      select: ['_id', 'product_price'],
    });

    expect(brandModel.findOne).toHaveBeenCalledWith({ brand_name: 'Acme' });
    expect(res.products).toEqual([{ _id: 'p1' }]);
    expect(res.pagination.totalResult).toBe(6);
    expect(res.pagination.page).toBe(2);
  });
});


//
// findProductsByBrandId
//
describe('findProductsByBrandId', () => {
  it('giới hạn số lượng và sort theo tham số', async () => {
    const lean = jest.fn().mockResolvedValue(['p1', 'p2']);
    const select = jest.fn(() => ({ lean }));
    const sort = jest.fn(() => ({ select }));
    const limit = jest.fn(() => ({ sort }));
    const populate2 = jest.fn(() => ({ limit }));
    const populate1 = jest.fn(() => ({ populate: populate2 }));
    product.find.mockReturnValue({ populate: populate1 });

    const res = await repo.findProductsByBrandId({ brandId: 'b1', limit: 3, sort: 'ctime' });
    expect(product.find).toHaveBeenCalled();
    expect(res).toEqual(['p1', 'p2']);
  });
});

//
// textSearch
//
describe('textSearch', () => {
  it('thực hiện text search và sort theo textScore', async () => {
    const lean = jest.fn().mockResolvedValue(['s1', 's2']);
    const select = jest.fn(() => ({ lean }));
    const sort = jest.fn(() => ({ select }));
    product.find.mockReturnValue({ sort, select });

    const res = await repo.textSearch({ key_search: 'hello' });
    expect(product.find).toHaveBeenCalled();
    expect(res).toEqual(['s1', 's2']);
  });
});
