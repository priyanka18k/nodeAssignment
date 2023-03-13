var blogModel = require('../models/blog.js');
var multer = require('multer');
const path = require("path");
var userModel = require('../models/user.js');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+"-"+file.originalname)
    }
  })
       

const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb){
        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
}).single("image");   

exports.createBlog = async function(req, res,next){
   var user_id ;
    try {
        upload(req,res,function(err) {
  
            if(err) {
                 res.send(err)
            }else {
                if (!(req.body.title && req.body.body )) {
                    return res.status(400).send("All input is required");
                }

                user_id = req.user.user_id
                var createBlog = new blogModel({
                    title: req.body.title,
                    body: req.body.body,
                    image: req.file.filename,
                   userId : user_id
                })

                createBlog.save().then((blog)=>{
                    console.log("new blog created===>"+blog);
                    res.status(200).json({
                        message:"Success, Blog created!"
                    })
                })

               
            }
        })
      } catch (error) {
        res.json({
          error,
        });
      }
}

exports.deleteBlog = async function(req, res,next){
    blogModel.findByIdAndRemove({_id : req.body.blogId}).exec().then((result)=>{
        if(result){
            res.json({
                result:"ok",
                message:"deleted"
            })
        }
    })
}

exports.updateBlog = async function(req, res,next){
    const filter = { _id: req.body.blogId };
    const update = { title: req.body.title,
    body : req.body.body };

    let doc = await blogModel.findOneAndUpdate(filter, update, {
    new: true
    });
    console.log(doc);
    res.status(200).json(doc);
}

exports.getAllBlogs = async function(req, res,next){
    var allBlogs = blogModel.find().exec().then((blogs)=>{
        res.json(blogs);
    })
}

exports.getBlog = async function(req, res,next){
    var blogs = blogModel.find({
        userId : req.user.user_id
    }).exec().then((blog)=>{
        res.status(200).json(blog);
    })   
}
