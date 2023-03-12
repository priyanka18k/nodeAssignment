var userModel = require('../models/user.js');
const jwt = require("jsonwebtoken");
const bcrypt= require("bcryptjs"); 
var nodemailer = require('nodemailer'); 

exports.createUser = async function (req,res) {
    console.log(req.body);
    if (!(req.body.email && req.body.password && req.body.name )) {
     return res.status(400).send("All input is required");
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
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
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

//https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/