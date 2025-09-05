const BASE_ENDPOINT = "";

export const ENDPOINTS = {
    AUTH : {
        LOGIN: `${BASE_ENDPOINT}/auth/login`,
        LOGOUT: `${BASE_ENDPOINT}/auth/logout`,
        REFRESH: `${BASE_ENDPOINT}/auth/refreshtoken`,
        INTROSPECT_TOKEN: `${BASE_ENDPOINT}/auth/introspect-token`,
    },
    CATEGORY : {
        FETCH_ALL: `${BASE_ENDPOINT}/category/all`,
        CREATE: `${BASE_ENDPOINT}/category/create`,
    },
    BRAND: {
        FETCH_ALL: `${BASE_ENDPOINT}/brand/all`,
        CREATE: `${BASE_ENDPOINT}/brand/create-brand`,
    },
    ADMIN: {
        PRODUCT: {
            FETCH_ALL: (page: number, limit: number) => `${BASE_ENDPOINT}/product/admin/all-products?page=${page}&limit=${limit}`,
            PUBLISH: (id: string) => `${BASE_ENDPOINT}/product/publish/${id}`,
            UNPUBLISH: (id: string) => `${BASE_ENDPOINT}/product/unpublish/${id}`,
            UPDATE: (id: string) => `${BASE_ENDPOINT}/product/update/${id}`,
            CREATE: `${BASE_ENDPOINT}/product/create-product`,
        },
        ORDER: {
            FETCH_ALL: (page: number) => `${BASE_ENDPOINT}/order/all-order?page=${page}`,
            UPDATE_STATUS: (orderId: string) => `${BASE_ENDPOINT}/order/update-status/${orderId}`,
            FETCH_ONE: (orderId: string) => `${BASE_ENDPOINT}/order/${orderId}`,
        },
    },
    PRODUCT: {
        FETCH_ONE: (id: string) => `${BASE_ENDPOINT}/product/${id}`,
        FILTER: (k?: string, categoryId?: string, brandName?: string, maxPrice?: number, minPrice?: number, limit?: number, sort?: string, page?: number) => {
            // Construct query parameters
            const params = new URLSearchParams();
            if (k) params.append('k', k);
            if (categoryId) params.append('categoryId', categoryId);
            if (brandName) params.append('brandName', brandName);
            if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
            if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
            if (limit !== undefined) params.append('limit', limit.toString());
            if (sort) params.append('sort', sort);
            if (page !== undefined) params.append('page', page.toString());
            return `${BASE_ENDPOINT}/product/filter?${params.toString()}`;
        },
        RELATED: (brandId: string) => `${BASE_ENDPOINT}/product/related?brandId=${brandId}`,
    },
    CART: {
        INIT: `${BASE_ENDPOINT}/cart`,
        ADD: `${BASE_ENDPOINT}/cart/add-to-cart`,
        UPDATE: `${BASE_ENDPOINT}/cart/update-cart`,
        DELETE: (id: string) => `${BASE_ENDPOINT}/cart/delete/${id}`,
    },
    ADDRESS: {
        FETCH_ALL: `${BASE_ENDPOINT}/address`,
        CREATE: `${BASE_ENDPOINT}/address/add`,
        UPDATE: (id: string) => `${BASE_ENDPOINT}/address/update/${id}`,
        DELETE: (id: string) => `${BASE_ENDPOINT}/address/rm/${id}`,
    },
    CHECKOUT: `${BASE_ENDPOINT}/checkout`,
    ORDER: {
        CREATE: `${BASE_ENDPOINT}/order/create`,
        FETCH_ALL: (page: number) => 
            `${BASE_ENDPOINT}/order/self?page=${page}`
    },
    PAYMENT: (totalPrice: number) => `${BASE_ENDPOINT}/payment?totalPrice=${totalPrice}`,
    PAYMENT_VERIFY: `${BASE_ENDPOINT}/payment/verify`,
}