const BASE_ENDPOINT = "";

export const ENDPOINTS = {
    AUTH : {
        LOGIN: `${BASE_ENDPOINT}/auth/login`,
        LOGOUT: `${BASE_ENDPOINT}/auth/logout`,
        REFRESH: `${BASE_ENDPOINT}/auth/refreshtoken`,
    }
}