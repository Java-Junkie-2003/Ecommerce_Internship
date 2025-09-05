
const {createBrand, getAllBrand, updateBrand, unPublishBrand} = require('../models/repositories/brand.repo')

class BrandService {
    static createBrand = async ({brand_name, brand_icon}) =>{
        return await createBrand({brand_name, brand_icon})
    }

    static getAllBrand = async () =>{
        return await getAllBrand()
    }

    static updateBrand = async ({ brand_id, brand_name, brand_icon}) => {
        return await updateBrand({ brand_id, brand_name, brand_icon})
    }

    static unPublish = async ({brand_id}) => {
        return await unPublishBrand({brand_id})
    }
}


module.exports = BrandService