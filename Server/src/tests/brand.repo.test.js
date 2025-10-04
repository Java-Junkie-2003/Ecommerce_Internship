jest.mock('../models/brand.model', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  updateOne: jest.fn(),
}));

jest.mock('../models/product.model', () => ({
  product: {
    updateMany: jest.fn(),
  },
}));

jest.mock('../utils', () => ({
  convertToObjectId: (v) => v,
}));

jest.mock('../core/error.response', () => {
  class BadRequestError extends Error {}
  class NotFoundError extends Error {}
  return { BadRequestError, NotFoundError };
});

const brandModel = require('../models/brand.model');
const { product } = require('../models/product.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');


const brandRepo = require('../models/repositories/brand.repo');

afterEach(() => {
  jest.clearAllMocks();
});

//
// createBrand
//
describe('createBrand', () => {
  it('tạo brand thành công và trả về document', async () => {
    const fakeDoc = { _id: '68be511f453c53ec09212d3b', brand_name: 'Acme', brand_icon: 'acme.png' };
    brandModel.create.mockResolvedValue(fakeDoc);

    const res = await brandRepo.createBrand({ brand_name: 'Acme', brand_icon: 'acme.png' });

    expect(brandModel.create).toHaveBeenCalledWith({ brand_name: 'Acme', brand_icon: 'acme.png' });
    expect(res).toBe(fakeDoc);
  });

  it('ném BadRequestError khi create trả về falsy', async () => {
    brandModel.create.mockResolvedValue(null);

    await expect(
      brandRepo.createBrand({ brand_name: 'X', brand_icon: 'x.png' })
    ).rejects.toThrow(BadRequestError);
  });
});

//
// getAllBrand
//
describe('getAllBrand', () => {
  it('trả về mảng brand từ brandModel.find()', async () => {
    const list = [{ _id: '1' }, { _id: '2' }];
    brandModel.find.mockResolvedValue(list);

    const res = await brandRepo.getAllBrand();

    expect(brandModel.find).toHaveBeenCalledTimes(1);
    expect(res).toEqual(list);
  });
});

//
// updateBrand
//
describe('updateBrand', () => {
  it('gọi updateOne với { brand_name, brand_icon } và trả về kết quả', async () => {
    const validId = '68be511f453c53ec09212d3b';
    const fakeResult = { acknowledged: true, modifiedCount: 1 };
    brandModel.updateOne.mockResolvedValue(fakeResult);

    const res = await brandRepo.updateBrand({
      brand_id: validId,
      brand_name: 'New Brand',
      brand_icon: 'new.png',
    });

    expect(brandModel.updateOne).toHaveBeenCalledWith(
      { _id: validId },
      { brand_name: 'New Brand', brand_icon: 'new.png' },
      { upsert: true, new: true }
    );
    expect(res).toBe(fakeResult);
  });

  it('updateOne vẫn gọi với object trống khi không truyền name/icon', async () => {
    const validId = '68be511f453c53ec09212d3b';
    const fakeResult = { acknowledged: true, modifiedCount: 0 };
    brandModel.updateOne.mockResolvedValue(fakeResult);

    const res = await brandRepo.updateBrand({ brand_id: validId });

    expect(brandModel.updateOne).toHaveBeenCalledWith(
      { _id: validId },
      { brand_name: undefined, brand_icon: undefined },
      { upsert: true, new: true }
    );
    expect(res).toBe(fakeResult);
  });
});

//
// unPublishBrand
//
describe('unPublishBrand', () => {
  it('ném NotFoundError nếu brand không tồn tại', async () => {
    const leanNone = jest.fn().mockResolvedValue(null);
    brandModel.findById.mockReturnValue({ lean: leanNone });

    await expect(
      brandRepo.unPublishBrand({ brand_id: '68be511f453c53ec09212d3b' })
    ).rejects.toThrow(NotFoundError);

    expect(brandModel.findById).toHaveBeenCalledWith('68be511f453c53ec09212d3b');
  });

  it('unpublish brand và set tất cả products về isPublished=false, isDraft=true', async () => {
    const validId = '68be511f453c53ec09212d3b';

    const leanBrand = jest.fn().mockResolvedValue({ _id: validId, isPublished: true });
    brandModel.findById.mockReturnValue({ lean: leanBrand });

    brandModel.updateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });

    product.updateMany.mockResolvedValue({ matchedCount: 5, modifiedCount: 5 });

    const res = await brandRepo.unPublishBrand({ brand_id: validId });

    // Kiểm tra các cập nhật đúng filter và payload
    expect(brandModel.updateOne).toHaveBeenCalledWith(
      { _id: validId, isPublished: { $ne: false } },
      { $set: { isPublished: false } }
    );

    expect(product.updateMany).toHaveBeenCalledWith(
      { product_brand: validId, isPublished: true },
      { $set: { isPublished: false, isDraft: true } }
    );

    expect(res).toEqual({
      brandUpdated: 1,
      productsMatched: 5,
      productsUpdated: 5,
    });
  });

  it('vẫn trả về counters đúng kể cả khi không có product nào đang published', async () => {
    const validId = '68be511f453c53ec09212d3b';

    const leanBrand = jest.fn().mockResolvedValue({ _id: validId, isPublished: false });
    brandModel.findById.mockReturnValue({ lean: leanBrand });

    brandModel.updateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 0 });
    product.updateMany.mockResolvedValue({ matchedCount: 0, modifiedCount: 0 });

    const res = await brandRepo.unPublishBrand({ brand_id: validId });

    expect(res).toEqual({
      brandUpdated: 0,
      productsMatched: 0,
      productsUpdated: 0,
    });

  });
});
