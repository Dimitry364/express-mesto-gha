const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: "65b16b3edbbbd24a9b49241a",
  };

  next();
});

app.use(routes);

mongoose.connect("mongodb://localhost:27017/mestodb", {});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
