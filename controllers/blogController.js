var blogModel = require('../models/blog.js');

exports.createBlog = async function(req, res){
    // console.log("req.body=>"+(req.body));
     console.log("req.body=>"+JSON.stringify(req.body.title));
     console.log("req.body=>"+JSON.stringify(req.body._body));
    // // req.file.path;
    //     console.log("file.................", req.files);
    // if (!(req.body.title && req.body._body )) {
    //     return res.status(400).send("All input is required");
    // }
    res.status(200).json({
        message: " ok "
    })
}