const BUSBOY = require("busboy");

exports.modulebusboy = function(req, res, callback){
    let arrayBuffer = [];
    req.busboyBody = {};
    let busboy = new BUSBOY({headers: req.headers});
    busboy.on("file", (flname, file, filename, encoding, mimetype)=>{
        req.busboyBody["file"] = {name: filename, mime: mimetype};
        file.on("data", (data)=>{
            arrayBuffer.push(data);
        });
        file.on("end", ()=>{
            let buffer = Buffer.concat(arrayBuffer);
            req.busboyBody["file"].data = buffer;
        })
    })
    busboy.on("field", (fieldname, value)=>{
        req.busboyBody[fieldname] = value;
    });
    busboy.on("finish", ()=>{
        req.body = req.busboyBody;
        callback(req, res);
    });
    req.pipe(busboy);
}