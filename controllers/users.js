const User = require("../models/user");
const mongoose = require("mongoose");
const ValidationError = mongoose.Error.ValidationError;
const CastError = mongoose.Error.CastError;
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/error");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
        return;
      } else if (err.message === "Not Found") {
        res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
        return;
      } else {
        res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
        return;
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      } else {
        res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
        return;
      }
    });
};

function updateProfile(req) {
  const { name, about } = req.body;
  return { name, about };
}

function updateAvatar(req) {
  const { avatar } = req.body;
  return { avatar };
}

function updateUserDecorator(update) {
  return function (req, res) {
    User.findByIdAndUpdate(req.user._id, update(req), {
      new: true,
      runValidators: true,
    })
      .orFail(() => new Error("Not Found"))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err instanceof ValidationError) {
          res.status(BAD_REQUEST).send({
            message:
              "Переданы некорректные данные при обновлении профиля или аватар",
          });
          return;
        } else if (err.message === "Not Found") {
          res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
          return;
        } else {
          res
            .status(SERVER_ERROR)
            .send({ message: "Внутренняя ошибка сервера" });
          return;
        }
      });
  };
}

updateProfile = updateUserDecorator(updateProfile);
updateAvatar = updateUserDecorator(updateAvatar);

module.exports = { getUsers, getUser, createUser, updateProfile, updateAvatar };
