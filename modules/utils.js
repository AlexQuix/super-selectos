const
    fs = require("fs"),
    ejs = require("ejs");


////////////////Content Type
let contentType = {
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    webp: "image/webp"
}





exports.renderFile = function(req, res, template, obj){
    let path = ejs.render((req.constant.view + template + ".html"));
    ejs.renderFile(path, obj, (err, chunck)=>{
        if(!err){
            res.setHeader("Conten-Type", "text/html");
            res.end(chunck);
        }
    });
};
exports.readFile = function(req, res){
    let path = req.constant.static + req.url;
    fs.readFile(path, (err, chunck)=>{
        if(!err){
            let type = req.url.match(/(\.([a-z])*)/i)[0].slice(1);
            res.setHeader("Content-type", contentType[type]);
            res.end(chunck);
        }
    });
};
exports.redirect = function(req, res, url){
    res.writeHead(301, {"Location": url});
    res.end();
};

