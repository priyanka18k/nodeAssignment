require('dotenv').config();
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer()
;
const bodyParser = require('body-parser');
// app.use(express.json());

// app.use(express.json({limit: '500mb'}));

// app.use(bodyParser.urlencoded({ limit: "50mb",extended : false, parameterLimit:50000}));

// app.use(bodyParser.urlencoded({ limit: "50mb",extended : false, parameterLimit:50000}));


const path = require("path");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/assignmentdb');
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection  errror :"));
db.once('connection', (stream) => {
    console.log('Ah, we have our first user!');
  });




  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));
var userController = require('./controllers/userController.js');
var blogController = require('./controllers/blogController');
const auth = require("./middleware/auth");



app.get('/',function(req,res){
    res.status(200).json({
        message: 'welcome to project'
    })
})

app.post('/createUser',userController.createUser);
app.post('/login',userController.login);
app.post('/createBlog',auth, blogController.createBlog);
app.get('/getAllBlogs',blogController.getAllBlogs);
app.get('/getBlog',auth,blogController.getBlog);
app.put('/updateBlog',auth,blogController.updateBlog);
app.delete('/deleteBlog',auth,blogController.deleteBlog);
    
// // View Engine Setup
// app.set("views",path.join(__dirname,"views"))
// app.set("view engine","ejs")
  
app.listen(port,function(){
    console.log('listening on port '+port);
})