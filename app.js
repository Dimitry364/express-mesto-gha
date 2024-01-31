const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const { loginValidator, userValidator} = require("./middlewares/validation");

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());

app.post('/signin', loginValidator, login);
app.post('/signup', userValidator, createUser);

app.use(auth);
app.use(routes);
app.use(errors());
app.use(errorHandler);

mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});