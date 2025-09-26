const CheckoutService = require('../services/checkout.service');
const { BadRequestError } = require('../core/error.response');
const orderModel = require('../models/order.model');

jest.mock('../models/repositories/cart.repo', () => ({
	findCartById: jest.fn(),
	deleteCart: jest.fn(),
}));
jest.mock('../models/repositories/product.repo', () => ({
	checkProductByServer: jest.fn(),
}));
jest.mock('../models/repositories/address.repo', () => ({
	findAddressById: jest.fn(),
}));
jest.mock('../services/redis.service', () => ({
	acquireLock: jest.fn(),
	releaseLock: jest.fn(),
}));
orderModel.create = jest.fn();

const { findCartById, deleteCart } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const { acquireLock, releaseLock } = require('../services/redis.service');
const { findAddressById } = require('../models/repositories/address.repo');

describe('CheckoutService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('checkoutReview', () => {
		it('should throw BadRequestError if cart not found', async () => {
			findCartById.mockResolvedValue(null);
			await expect(CheckoutService.checkoutReview({ userId: 'u1', item_products: [] }))
				.rejects.toThrow(BadRequestError);
		});

		it('should throw BadRequestError if checkProductServer[0] is falsy', async () => {
			findCartById.mockResolvedValue({});
			checkProductByServer.mockResolvedValue([null]);
			await expect(CheckoutService.checkoutReview({ userId: 'u1', item_products: [] }))
				.rejects.toThrow(BadRequestError);
		});

		it('should return correct checkout order', async () => {
			findCartById.mockResolvedValue({});
			checkProductByServer.mockResolvedValue([
				{ price: 100, quantity: 2 },
				{ price: 50, quantity: 1 },
			]);
			const result = await CheckoutService.checkoutReview({ userId: 'u1', item_products: [] });
			expect(result.checkout_order.totalPrice).toBe(250);
			expect(result.checkout_order.totalCheckout).toBe(250 + 30000);
			expect(result.item_products.length).toBe(2);
		});
	});

	describe('orderByUser', () => {
		it('should throw BadRequestError if a product is not enough stock', async () => {
			findCartById.mockResolvedValue({});
			checkProductByServer.mockResolvedValue([
				{ productId: 'p1', price: 100, quantity: 2 },
			]);
			acquireLock.mockResolvedValueOnce({ key: null, token: null });
			await expect(CheckoutService.orderByUser({ item_products: [{ productId: 'p1', quantity: 2 }], userId: 'u1', addressId: 'a1', payment_method: 'COD' }))
				.rejects.toThrow(BadRequestError);
		});

		it('should create order and delete cart if all products are in stock', async () => {
			findCartById.mockResolvedValue({});
			checkProductByServer.mockResolvedValue([
				{ productId: 'p1', price: 100, quantity: 2 },
			]);
			acquireLock.mockResolvedValue({ key: 'lock1', token: 'token1' });
			releaseLock.mockResolvedValue(true);
			findAddressById.mockResolvedValue({ address: 'test' });
			orderModel.create.mockResolvedValue({ _id: 'order1' });
			deleteCart.mockResolvedValue(true);
			const result = await CheckoutService.orderByUser({ item_products: [{ productId: 'p1', quantity: 2 }], userId: 'u1', addressId: 'a1', payment_method: 'COD' });
			expect(orderModel.create).toHaveBeenCalled();
			expect(deleteCart).toHaveBeenCalledWith({ userId: 'u1', productId: 'p1' });
			expect(result).toEqual({ _id: 'order1' });
		});
	});
});
