
const {createBrand, getAllBrand} = require('../models/repositories/brand.repo')

class BrandService {
    static createBrand = async ({brand_name, brand_icon}) =>{
        return await createBrand({brand_name, brand_icon})
    }

    static getAllBrand = async () =>{
        return await getAllBrand()
    }
}


module.exports = BrandService