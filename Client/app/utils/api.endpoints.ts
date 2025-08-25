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
        }
    },
    PRODUCT: {
        FETCH_ONE: (id: string) => `${BASE_ENDPOINT}/product/${id}`,
    }
}