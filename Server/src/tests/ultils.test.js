const utils = require('../utils');
const { Types } = require('mongoose');

describe('Utils functions', () => {
	test('getSelectData returns correct object', () => {
		expect(utils.getSelectData(['a', 'b'])).toEqual({ a: 1, b: 1 });
	});

	test('getUnSelectData returns correct object', () => {
		expect(utils.getUnSelectData(['a', 'b'])).toEqual({ a: 0, b: 0 });
	});

	test('convertToObjectId returns ObjectId', () => {
		const id = '507f1f77bcf86cd799439011';
		expect(utils.convertToObjectId(id)).toBeInstanceOf(Types.ObjectId);
		expect(utils.convertToObjectId(id).toString()).toBe(id);
	});

	test('genSecretKey returns keys', () => {
		const keys = utils.genSecretKey();
		expect(keys).toHaveProperty('publicKey');
		expect(keys).toHaveProperty('privateKey');
		expect(typeof keys.publicKey).toBe('string');
		expect(typeof keys.privateKey).toBe('string');
		expect(keys.publicKey.length).toBeGreaterThan(0);
		expect(keys.privateKey.length).toBeGreaterThan(0);
	});

	test('getInfoData picks fields', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(utils.getInfoData({ fields: ['a', 'c'], object: obj })).toEqual({ a: 1, c: 3 });
	});

	test('removeUndefinedObject removes null/undefined', () => {
		const obj = { a: 1, b: null, c: undefined, d: 2 };
		expect(utils.removeUndefinedObject(obj)).toEqual({ a: 1, d: 2 });
	});

	test('updateNestedObjectParser flattens nested object', () => {
		const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
		expect(utils.updateNestedObjectParser(obj)).toEqual({ a: 1, 'b.c': 2, 'b.d.e': 3 });
	});

	test('ensureArray works for array', () => {
		expect(utils.ensureArray([1, 2])).toEqual([1, 2]);
	});
	test('ensureArray works for string', () => {
		expect(utils.ensureArray('a,b,c')).toEqual(['a', 'b', 'c']);
	});
	test('ensureArray works for single value', () => {
		expect(utils.ensureArray(5)).toEqual([5]);
	});
	test('ensureArray works for null/undefined', () => {
		expect(utils.ensureArray(null)).toEqual([]);
		expect(utils.ensureArray(undefined)).toEqual([]);
	});

	test('normalizeGender returns correct value', () => {
		expect(utils.normalizeGender('male')).toBe('Male');
		expect(utils.normalizeGender('nam')).toBe('Male');
		expect(utils.normalizeGender('female')).toBe('Female');
		expect(utils.normalizeGender('nu')).toBe('Female');
		expect(utils.normalizeGender('nữ')).toBe('Female');
		expect(utils.normalizeGender('unisex')).toBe('Unisex');
		expect(utils.normalizeGender('other')).toBeNull();
	});
});
