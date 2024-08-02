const userModel = require("../models/user-models");
// const handleMulterUpload = require("../helpers/image-uploading");

const handlePostUser = async (req, res) => {
  const { userName, phoneNo, emailId, address, companyName, cin, pan, gstNo } =
    req.body;

  try {
    const newOrganization = await userModel.create({
      userName,
      phoneNo,
      emailId,
      address,
      companyName,
      cin,
      pan,
      gstNo,
    });
    if (
      (companyName !== null &&
        (cin === null || pan === null || gstNo === null)) ||
      (cin !== null &&
        (companyName === null || pan === null || gstNo === null)) ||
      (pan !== null &&
        (companyName === null || cin === null || gstNo === null)) ||
      (gstNo !== null && (companyName === null || cin === null || pan === null))
    ) {
      return res.json({
        message: "Entering all fields is mandatory for organization",
        success: false,
        status: 204,
      });
    }
    return res.json({
      message: "Organization created successfully",
      success: true,
      status: 201,
      data: newOrganization,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server side error occurred",
      success: false,
      status: 500,
    });
  }
};

const handleFetchAllOrganization = async (req, res) => {
  try {
    const fetchData = await userModel.find({
      userName: { $ne: null },
      phoneNo: { $ne: null },
      emailId: { $ne: null },
      address: { $ne: null },
      companyName: { $ne: null },
      cin: { $ne: null },
      pan: { $ne: null },
      gstNo: { $ne: null },
      panFile: { $ne: null },
      cinFile: { $ne: null },
    });
    if (!fetchData || fetchData.length === 0) {
      return res.json({
        message: "No data found with the specified criteria",
        status: 404,
      });
    } else {
      return res.json(fetchData);
    }
  } catch (error) {
    return res.json({ message: "Server side error occured", status: 500 });
  }
};

const handleDocumentUploading = async (req, res) => {
  const panFile = req.files && req.files.panFile ? req.files.panFile[0] : null;
  const cinFile = req.files && req.files.cinFile ? req.files.cinFile[0] : null;
  const { cin } = req.params;
  const { pan } = req.params;
};

const express = require("express");
const userPostingRouter = express.Router();
const userRetrievalRouter = express.Router();

userPostingRouter.post("/users/post-user", handlePostUser);
userRetrievalRouter.get(
  "/users/get-all-oraganisations",
  handleFetchAllOrganization
);

module.exports = {
  userPostingRouter: userPostingRouter,
  userRetrievalRouter: userRetrievalRouter,
};
