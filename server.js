require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const port = process.env.PORT || 5000;
app.listen(port);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
