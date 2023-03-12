require('dotenv').config();
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');

// app.use(express.json({limit: '500mb'}));

// app.use(bodyParser.urlencoded({ limit: "50mb",extended : false, parameterLimit:50000}));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ limit: "50mb",extended : false, parameterLimit:50000}));


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/assignmentdb');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection  errror :"));
db.once('connection', (stream) => {
    console.log('Ah, we have our first user!');
  });
var userController = require('./controllers/userController.js');
var blogController = require('./controllers/blogController');
const auth = require("./middleware/auth");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.single()); 
app.use(express.static('public'));

// app.use(express.bodyParser({limit: '50mb'}));
// app.use(express.json({limit: '500mb'}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ limit: "500mb",extended : false, parameterLimit:50000}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ limit: "50mb",extended : false, parameterLimit:50000}));
app.get('/',function(req,res){
    res.status(200).json({
        message: 'welcome to project'
    })
})

app.post('/createUser',userController.createUser);
app.post('/login',userController.login);
app.post('/createBlog', auth,upload.single('file'), blogController.createBlog);


app.listen(port,function(){
    console.log('listening on port '+port);
})