const cloudinary = require('cloudinary').v2;
const  { CloudinaryStorage }  = require('multer-storage-cloudinary');

cloudinary.config({     //config means jodna
    cloud_name: process.env.CLOUD_NAME, //the "process" object is to access environment variables using process.env.
    api_key : process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// create a folder to store file and define the types of formates are allowed to store 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
  });
   
  module.exports = {
    cloudinary,
    storage,
  };    