const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");
const PORT = process.env.PORT || '8000';
require('dotenv').config();

/*middlewares*/
app.use(bodyParser.json({
  limit: '150mb',
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//mongodb connection using mongoose
const conectionUrl = process.env.conectionUrl;
mongoose.connect(conectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() =>
  console.info('MongoDb Connected....')
).catch(err => console.log(err));

mongoose.Promise = global.Promise;

app.get('/', (req, res) => {
  res.send('Welcome to demo!')
})

/*Incudes all routes*/
require('./routes/index')(app, mongoose);

/*Listen express server on port*/
app.listen(PORT, () => {
  console.info(`Server is running on port.... ${PORT}`);
});
