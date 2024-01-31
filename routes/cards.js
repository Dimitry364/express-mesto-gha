const router = require("express").Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const { createCardValidator, idValidator } = require("../middlewares/validation");

router.get("/", getCards);
router.post("/", createCardValidator, createCard);
router.put("/:cardId/likes", idValidator, likeCard);
router.delete("/:cardId", idValidator, deleteCard);
router.delete("/:cardId/likes", idValidator, dislikeCard);

module.exports = router;
