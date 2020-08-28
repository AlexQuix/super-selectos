const utils = require("../modules/utils.js"),
    busboy = require("../modules/busboy.js"),
    DataBase = require("../modules/database.js"),
    fs = require("fs"),
    urlencode = require("urlencode"),
    queryString = require("query-string");


/// ARCHIVOS ESTATICOS
let pathFiles = [];
function openBinder(){
    function openDir(path){
        let DIR = fs.opendirSync(path);
        function readDir(){
            let dirent = DIR.readSync();
            if(dirent){
                if(dirent.isDirectory()){
                    openDir(`${DIR.path}/${dirent.name}`);
                    readDir();
                }else if(dirent.isFile()){
                    pathFiles.push(`${DIR.path}/${dirent.name}`)
                    readDir();
                }
            }else{
                DIR.close();
            }
        }
        readDir();
    }
    openDir("./static");
}
openBinder();

function middlware(req, res){
    // Middlware de archivos estaticos
    for(let value of pathFiles){
        if(value.includes(req.url)){
            utils.readFile(req, res);
        }
    }
}
// PARAMS
function params(req, res, param, callback){
    // Middlware de rutas
        if(req.url.includes(param)){
            req.params = req.url.match(/((([a-z])*)$)/i)[0];
            callback(req, res);
        }
}




exports.router = function(req, res){
    req.constant = {view: "./views/", static: "./static"};
    // MIDDLWARE
    middlware(req, res);
    params(req, res, "/login/", (req, res)=>{
        if(req.method === "GET"){
            if(req.params === "signin" || req.params === "signup" || req.params === "informacioncuenta"){
                utils.renderFile(req, res, "login", {login: req.params});
            };
        }
    });

    params(req, res, "/product/clasification/", (req, res)=>{
        if(req.method === "GET"){
            utils.renderFile(req, res, "product", {clasification: req.params});
        }
    });

    params(req, res, "/post/product/clasification/", (req, res)=>{
        if(req.method === "POST"){
            if(req.params === "aseo"){
                req.params = "aseo personal";
            }
            req.url = "/post/product/clasification";
        }
    });

    params(req, res, "/post/product/serch-product/", (req, res)=>{
        if(req.method === "POST"){
            req.params = req.url.match(/((([a-zA-Z0-9])*-[0-9])$)/i)[0];
            req.url = "/post/product/serch-product/located";
        }
    });

    if(req.method === "GET"){
        //RUTAS
        switch(req.url){
            /////////////// RUTING
            case "/": utils.renderFile(req, res, "home", {});
            break;
            case "/login": utils.redirect(req, res, "/login/signin");
            break;
            case "/product/clasification/general": utils.renderFile(req, res, "product", {});
            break;
            case "/add-producto": utils.renderFile(req, res, "addproduct", {});
            break;
            case "/about": utils.renderFile(req, res, "about", {});
            break;
        }
    }else if(req.method === "POST"){
        /// BODY
        req.on("data", (chunk)=>{
            let string = Buffer.concat([chunk]).toString();
            req.body = urlencode.parse(string);
            switch(req.url){
                case "/login/signin": utils.redirect(req, res, "/");           
                break;
                case "/login/signup": utils.redirect(req, res, "/");
                break;
                case "/login/signin/cheek-data": (function(){
                                                    let data = DataBase.DBreadUser();
                                                    let {user, password} = req.body;
                                                    if(data[user]){
                                                        if(data[user].user === user && data[user].password === password){
                                                            res.setHeader("Content-Type", "text/json");
                                                            let json = JSON.stringify(data[user]);
                                                            res.end(json);
                                                        }else{
                                                            res.setHeader("Content-Type", "text/plain");
                                                            res.end("El usuario o la contraseña son incorrectas");
                                                        };
                                                    }else{
                                                        res.setHeader("Content-Type", "text/plain");
                                                        res.end("El usuario no existe");
                                                    }; 
                                                })();
                break;
                case "/product/serch-product": (function(){
                                                    let jsonProduct = DataBase.DBreadProduct();
                                                    let dataProduct = jsonProduct[req.body.clasification][req.body.id];                           
                                                    let json = JSON.stringify(dataProduct);
                                                    res.setHeader("Content-Type", "text/plain");
                                                    res.end(json);
                                                })();
                break;
                case "/post/product/serch-keyword": (function(){
                                                        let data = DataBase.DBListProduct["list product"];
                                                        let result = data.filter(e=>e['key word'].includes(req.body.word))
                                                        let json = JSON.stringify(result);
                                                        res.end(json);
                                                    })();   
                break;
            }
        });
        // FORMDATA
        switch(req.url){
            ////////////////// LOGIN
            case "/login/signup/cheek-user": busboy.modulebusboy(req, res, (req, res)=>{
                                                let json = DataBase.DBreadUser();
                                                if(json[req.body.user]){
                                                    res.setHeader("Content-Type", "text/plain");
                                                    res.end("El nombre ya esta ocupado");
                                                }else{
                                                    res.setHeader("Content-Type", "text/plain");
                                                    res.end("OK");
                                                }
                                            });
            break;
            case "/login/signup/create-user": busboy.modulebusboy(req, res, (req, res)=>{
                                                DataBase.DBchangeUser((data)=>{
                                                    if(req.body){
                                                        data[req.body.user] = req.body;
                                                        let json = JSON.stringify(req.body);
                                                        res.setHeader("Content-type", "text/plain");
                                                        res.end(json);
                                                    }else{
                                                        res.setHeader("Content-type", "text/plain");
                                                        res.end("err");
                                                    }
                                                    return data;
                                                });
                                            });
            break;
            ///////////////////// PRODUCTOS
            case "/product/add-product": busboy.modulebusboy(req, res, (req, res)=>{
                                            DataBase.DBchangeProduct((json)=>{
                                                json[req.body["classification"]][req.body.id] = req.body;
                                                return json;
                                            })
                                            res.end("agregado exitosamente");
                                        });
            break;
            case "/post/product/list-product": let jsonList = DataBase.DBListProduct["list product"];
                                            let jsonProduct = DataBase.DBreadProduct();
                                            let json = {};
                                            for(let i = 0; i < 5; ++i){
                                                let index = Math.floor(Math.random() * 29);
                                                if(index){
                                                    for(let classification in jsonProduct){
                                                        let product = jsonProduct[classification][jsonList[index]["id"]];
                                                        if(product){
                                                            json[product.id] = product;
                                                            break;
                                                        }
                                                    }
                                                }
                                            };
                                            res.setHeader("Content-Type", "text/plain");
                                            res.end(JSON.stringify(json));  
            break;
            case "/post/product/clasification": (function(){
                                                    let data = DataBase.DBreadProduct();
                                                    let json = JSON.stringify(data[req.params]);
                                                    res.setHeader("Content-Type", "text/plain");
                                                    res.end(json);
                                                })();
            break;
            case "/post/product/serch-product/located": (function(){
                                                            res.setHeader("Content-Type", "text/plain")
                                                            let data = DataBase.DBreadProduct();
                                                            for(let clasification in data){
                                                                let product = data[clasification][req.params];
                                                                if(product){
                                                                    let json = JSON.stringify(product);
                                                                    res.end(json);
                                                                    break;
                                                                }
                                                            }
                                                        })();
            break;
        }
    }
}