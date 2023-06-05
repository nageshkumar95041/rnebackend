const cloudinary=require("cloudinary").v2
const dotenv=require("dotenv").config();
const cloud_name=process.env.CLOUDNAME;
const api_key=process.env.APIKEY;
const apiSecret=process.env.APISECRET;
cloudinary.config({
    cloud_name:'dvz91aalg',
    api_key:'541874581623526',
    api_secret:'QjyWc9pD99B5T-KrPFf3Pt-bSsw'
})
module.exports=cloudinary;