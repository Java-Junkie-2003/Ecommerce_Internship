const { BadRequestError } = require('../../core/error.response')
const brandModel = require('../brand.model')


const createBrand = async ({brand_name, brand_icon})=>{
    const newBrand = await brandModel.create({brand_name, brand_icon})
    if(!newBrand) throw new BadRequestError("Can't create now!")
    return newBrand
}

const getAllBrand = async() =>{
    return await brandModel.find();
}


module.exports = {
    createBrand,
    getAllBrand
}