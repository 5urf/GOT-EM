const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: "public-read-write",
    key: function (req, file, cb) {
      cb(
        null,
        Math.floor(Math.random() * 100) +
          "_" +
          Date.now() +
          "." +
          file.originalname.split(".").pop()
      );
    },
  }),
});

module.exports = upload;
