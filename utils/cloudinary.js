const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(fileToUploads, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };
  const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(fileToDelete, (result) => {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      });
    });
  };
  

  module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };