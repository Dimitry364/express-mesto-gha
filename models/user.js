const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: 2,
      maxlength: 30,
    },
    about: {
      default: "Исследователь",
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: "Некорректый формат почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    toObject: {
      useProjection: true,
    },
    toJSON: {
      useProjection: true,
    },
  }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
