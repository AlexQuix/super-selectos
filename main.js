const 
    http = require("http"),
    fs = require("fs"),
    ////////////// MODULOS
    constroler = require("./controller/controller");


http.createServer(constroler.router).listen(3000);
console.log("Server on");