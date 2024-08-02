const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
require("dotenv").config();

aws.config.update({
  secretAccessKey: process.env.secret_key_aws,
  accessKeyId: process.env.access_key_aws,
  region: process.env.my_aws_region,
});

const s3 = new aws.S3();

s3.putObject({
  Body: fs.readFileSync(file),
  Bucket: process.env.aws_bucket_name,
  Key: Math.floor(Math.random() * 10),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid mime type, only JPEG and PNG"), false);
  }
};

const handleMulterUpload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.aws_bucket_name,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_META_DATA" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
}).fields([
  { name: "panFile", maxCount: 1 },
  { name: "cinFile", maxCount: 1 },
]);

// module.exports = handleMulterUpload;
