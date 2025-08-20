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
    }
}