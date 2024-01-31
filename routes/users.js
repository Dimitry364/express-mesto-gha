const router = require("express").Router();
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");
const {
  idValidator,
  updateProfileValidator,
  updateAvatarValidator
} = require("../middlewares/validation");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", idValidator, getUser);
router.patch("/me", updateProfileValidator, updateProfile);
router.patch("/me/avatar", updateAvatarValidator, updateAvatar);

module.exports = router;