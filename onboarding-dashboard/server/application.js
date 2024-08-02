const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const aws = require("aws-sdk");
const app = express();
const server = http.createServer(app);
dotenv.config();
const port_no = process.env.port_no;
const connectDB = require("./config/dbConnection");
const {
  userPostingRouter,
  userRetrievalRouter,
} = require("./controllers/user-controllers");
const orderPostingRouter = require("./controllers/order-controllers");
const multer = require("multer");
const upload = multer();
const cors = require("cors");
connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.json("Server started successfully");
});
app.use("/v1/api", userPostingRouter);
app.use("/v1/api", userRetrievalRouter);
app.use("/v1/api", orderPostingRouter);

app.use(fileUpload());
const s3 = new aws.S3();

app.post("/upload", (req, res) => {
  const file = req.files.file;
  const params = {
    Bucket: process.env.aws_bucket_name,
    Key: file.name,
    Body: file.data,
    ACL: "public-read",
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading file to S3");
    } else {
      console.log("File uploaded successfully:", data.Location);
      res.send("File uploaded successfully");
    }
  });
});

server.listen(port_no, () => {
  console.log(`App launched successfully on port no ${port_no}`);
});
