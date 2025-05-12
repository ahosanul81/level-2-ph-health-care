import multer from "multer";
import path, { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "dgs2ywdd6",
  api_key: "926875478541658",
  api_secret: "GLepioc8wousbFfiMhnvm4H2lyM",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// export const uploadToCLoudinary = async (file: any) => {
//   //   console.log(file);

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(file.path, {
//       public_id: file.originalname,
//     });
//     (error: any, result: any) => {
//       if (error) {
//         console.log(error);

//         reject(error);
//       } else {
//         console.log(result);

//         resolve(result);
//       }
//     };
//   });
// };

export const uploadToCLoudinary = async (file: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        public_id: file.originalname,
      },
      (error: any, result: any) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};
export const upload = multer({ storage: storage });
