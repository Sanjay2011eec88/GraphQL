const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

//Importing grpahql schema
const schema = require('./graphql/schema');
//Importing resolver 
const resolver = require('./graphql/resolvers');
const app = express();
const graphqlHttp = require('express-graphql');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

//Writing graphql query for API
//This can be any http method
//Adding graphiql to show API doc and play around with API
app.use('/graphql', graphqlHttp({
  schema: schema,
  rootValue: resolver,
  graphiql: true,
  customFormatErrorFn(err){
    //This function is for creating custom error in graphql
      //Original error object contians the data we set when we throw the error and can be displayed here.
    if(!err.originalError) {
      console.log("this");
      return err;
    }
    console.log(err);
    const data = err.originalError.data;
    const message = err.message || 'An error occured';
    const code = err.originalError.code || 500;
    return{message: message, status: code, data: data}
  }
}))

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb://localhost:27017/messages'
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
