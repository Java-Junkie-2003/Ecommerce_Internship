
jest.mock('../models/category.model', () => ({
  create: jest.fn(),
  find: jest.fn(),
  updateOne: jest.fn(),
}));

// SUT import: '../../core/error.response' => mock để so sánh instanceof
jest.mock('../core/error.response', () => {
  class BadRequestError extends Error {}
  return { BadRequestError };
});

const categoryModel = require('../models/category.model');
const { BadRequestError } = require('../core/error.response');

// Require SUT sau khi mock
const categoryRepo = require('../models/repositories/category.repo');

afterEach(() => {
  jest.clearAllMocks();
});

//
// createCategory
//
describe('createCategory', () => {
  it('tạo category thành công và trả về document', async () => {
    const fakeDoc = { _id: '68be511f453c53ec09212d3b', category_name: 'Perfume' };
    categoryModel.create.mockResolvedValue(fakeDoc);

    const res = await categoryRepo.createCategory({ category_name: 'Perfume' });

    expect(categoryModel.create).toHaveBeenCalledWith({ category_name: 'Perfume' });
    expect(res).toBe(fakeDoc);
  });

  it('ném BadRequestError khi create trả về falsy', async () => {
    categoryModel.create.mockResolvedValue(null);

    await expect(
      categoryRepo.createCategory({ category_name: 'Anything' })
    ).rejects.toThrow(BadRequestError);
  });
});

//
// getAllCategory
//
describe('getAllCategory', () => {
  it('trả về danh sách category từ model.find()', async () => {
    const list = [{ _id: '1', category_name: 'A' }, { _id: '2', category_name: 'B' }];
    categoryModel.find.mockResolvedValue(list);

    const res = await categoryRepo.getAllCategory();

    expect(categoryModel.find).toHaveBeenCalledTimes(1);
    expect(res).toEqual(list);
  });
});

//
// updateCategory
//
describe('updateCategory', () => {
  it('ném BadRequestError nếu category_id không hợp lệ hoặc thiếu', async () => {
    // Thiếu category_id
    await expect(
      categoryRepo.updateCategory({ category_id: undefined, category_name: 'X' })
    ).rejects.toThrow(BadRequestError);

    // Sai định dạng ObjectId
    await expect(
      categoryRepo.updateCategory({ category_id: 'bad-id', category_name: 'X' })
    ).rejects.toThrow(BadRequestError);
  });

  it('gọi updateOne với body rỗng khi không truyền category_name', async () => {
    // Id hợp lệ: 24 ký tự hex
    const validId = '68be511f453c53ec09212d3b';
    const fakeResult = { acknowledged: true, modifiedCount: 1 };
    categoryModel.updateOne.mockResolvedValue(fakeResult);

    const res = await categoryRepo.updateCategory({ category_id: validId });

    expect(categoryModel.updateOne).toHaveBeenCalledWith(
      { _id: validId },
      {},
      { upsert: true, new: true }
    );
    expect(res).toBe(fakeResult);
  });

  it('gọi updateOne với category_name mới khi truyền category_name', async () => {
    const validId = '68be511f453c53ec09212d3b';
    const fakeResult = { acknowledged: true, modifiedCount: 1 };
    categoryModel.updateOne.mockResolvedValue(fakeResult);

    const res = await categoryRepo.updateCategory({
      category_id: validId,
      category_name: 'New Name',
    });

    expect(categoryModel.updateOne).toHaveBeenCalledWith(
      { _id: validId },
      { category_name: 'New Name' },
      { upsert: true, new: true }
    );
    expect(res).toBe(fakeResult);
  });
});
