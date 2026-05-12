const express =
require("express");

const router =
express.Router();

const {

  searchUsers,

  uploadProfilePic,

} = require(
  "../controllers/userController"
);

const upload =
require(
  "../middleware/multer"
);


// SEARCH
router.get(
  "/search",
  searchUsers
);


// PROFILE UPLOAD
router.post(

  "/upload-profile",

  upload.single(
    "profilePic"
  ),

  uploadProfilePic
);

module.exports =
router;