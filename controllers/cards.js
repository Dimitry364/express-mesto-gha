const Card = require("../models/card");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/error");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({
            message: "Переданы некорректные данные при создании карточки",
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные при удалении карточки" });
        return;
      } else if (err.message === "Not Found") {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      } else {
        res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
        return;
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные постановки лайка" });
        return;
      } else if (err.message === "Not Found") {
        res.status(NOT_FOUND).send({ message: "Карточка найдена" });
        return;
      } else {
        res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
        return;
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные для снятия лайка" });
        return;
      } else if (err.message === "Not Found") {
        res.status(NOT_FOUND).send({ message: "Карточка найдена" });
        return;
      } else {
        res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
        return;
      }
    });
};

module.exports = { getCards, deleteCard, createCard, likeCard, dislikeCard };
