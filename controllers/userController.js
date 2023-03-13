var userModel = require('../models/user.js');
const jwt = require("jsonwebtoken");
const bcrypt= require("bcryptjs"); 
var nodemailer = require('nodemailer'); 

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.createUser = async function (req,res) {
    console.log(req.body);
    if (!(req.body.email && req.body.password && req.body.name )) {
     return res.status(400).send("All input is required");
    }
    if(!(validateEmail(req.body.email))){
      return res.status(400).send("Please enter valid email address");
    }
    const user=await userModel.findOne({email: req.body.email}).exec();
      console.log("already user==>"+JSON.stringify(user));
      if(user) {
        return res.status(400).json({
        message: "USER ALREADY REGISTERED.",
        });
      }
   
      encryptedPassword = await bcrypt.hash(req.body.password, 10);
        var createUser = new userModel({
          email: req.body.email,
          name: req.body.name,
          password: encryptedPassword,
          status: 'Inactive'
        });
        createUser.save().then((result) => {
          console.log("already user==>"+JSON.stringify(result));
          var resultmail = result.email
          const token = jwt.sign(
            { user_id: result._id,resultmail  },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          console.log("token==>"+JSON.stringify(token));
          // save user token
          result.token = token;
      


var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
     secure: false,
  service: 'gmail',
  auth: {
    user: process.env.basicMailAdd,
    pass: process.env.basicMailPassword
  }
});

var mailOptions = {
  from: process.env.basicMailAdd,
  to: '1995priyankakhandagale@gmail.com',
  subject: 'Activation link',
  html: `<html>Please activate nodeassignment user account by clicking below link `+
  `<a href="localhost:3000/activateUser/`+req.body.email+`">localhost:3000/activateUser/`+req.body.email+`</a></html>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
          return res.status(201).json(result);
        }).catch((err) => {
          console.log(err);
          return   res.status(400).json({
            error: err,
          });
        });
  
  
  };

exports.login = async function (req,res){
  
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({
        message:"All input is required."
      });
    }
    const user = await userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      res.status(200).json(user);
    }else{
      res.status(400).send("Invalid Credentials");
   
    }
  
  } catch (err) {
    console.log(err);
    res.status(400);
   
  }
}

exports.activateUser = async function(req,res){
  var email = req.params.email
  console.log("req.params.email====>"+req.params.email);
   userModel.findOne({ email : email}).then(async (user)=>{
    console.log("user==>"+user);
  const filter = {_id: user._id};
  const update = { status : 'active' };
    if (user){
     var result = await userModel.findOneAndUpdate(filter, update, {
        new: true
        });
        res.json({
          message:'Activation done.'
        })

    }
   
  });
  
}
