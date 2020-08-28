const fs = require("fs");

/////// BASE DE DATOS DE LOS USUARIOS
let $readDBUser = fs.readFileSync("./database/user.json", {encoding: "utf-8"});
let $jsonDBUser = JSON.parse(`${$readDBUser}`);


////////////////// Cambiar datos de USER
function DBchangeUser(callback){
    let data = callback($jsonDBUser);
    writeDBUser(data);
    $jsonDBUser = data;
}
function writeDBUser(data){
    let stream = fs.createWriteStream("./database/user.json", {flags: "w"})
    let num = 0;
    stream.write("{")
    for(let user in data){
        if(user !== "usuarios"){
            stream.write(`\n"${user}":{`);
            for(let prop in data[user]){
                (prop === "money")?stream.write(`"money":"${data[user][prop]}"},`):
                stream.write(`"${prop}":"${data[user][prop]}",`);
            }
        }
        ++num;
    }
    --num
    stream.write(`\n"usuarios": ${num}`);
    stream.write("\n}")
    stream.close();
}


////////////////////// USUARIOS
exports.DBchangeUser = DBchangeUser;

exports.DBreadUser = function(){
    return $jsonDBUser;
};








/////// BASE DE DATOS DE LOS PRODUCTOS
let $DBreadProduct = fs.readFileSync("./database/product.json", {encoding: "utf-8"});
let $jsonProduct = JSON.parse(`${$DBreadProduct}`);



///////////// Cambiar datos de PRODUCTOS
function DBchangeProduct(callback){
    let data = callback($jsonProduct);
    writeDBProduct(data);
    $jsonProduct = data;
}
function writeDBProduct(data){
    let stream = fs.createWriteStream("./database/product.json", {flags: "w"})
    stream.write("{\n");
    for(let classProd in $jsonProduct){
        stream.write(`"${classProd}":{`);
        for(let id in data[classProd]){
            if(id !== "relleno"){
                stream.write(`,\n"${id}":{`);
                for(let prod in data[classProd][id]){
                    if(prod !== "id"){
                        if(prod === "file"){
                            stream.write(`"file":{`)
                            for(let value in data[classProd][id]["file"]){
                                if(value !== "data"){
                                    (value === "name")?stream.write(`"${value}": "${data[classProd][id]["file"][value]}",`):
                                    stream.write(`"${value}": "${data[classProd][id]["file"][value]}"},`);
                                }
                            }
                        }else{
                            stream.write(`"${prod}":"${data[classProd][id][prod]}",`);
                        }
                    }else{
                        stream.write(`"${prod}":"${id}"}`);
                    }
                }
            }else{
                stream.write(`"relleno":"none"`);
            }
        }
        (classProd === "mas")? stream.write("\n}\n") : stream.write("\n},\n");
    }
    stream.write("\n}")
    stream.close();
}


///////////// PRODUCTOS
exports.DBchangeProduct = DBchangeProduct;

exports.DBreadProduct = function(){
    return $jsonProduct;
};












////////////// LIST PRODUCTOS

let $readListProduct = fs.readFileSync("./database/listproduct.json", {encoding: "utf-8"});
let $jsonListProduct = JSON.parse(`${$readListProduct}`);


exports.DBListProduct = $jsonListProduct;

// No llamar, ya que queda en especie de bucle
function listProduct(){
    let stream = fs.createWriteStream("./database/listproduct.json", {flags: "w"});
    
    stream.write(`{ "list": [`);
    stream.write(`{"relleno":"true"}`)
    for(let clasification in $jsonProduct){
        for(let ids in $jsonProduct[clasification]){
            let key = $jsonProduct[clasification][ids]["wordkey"];
            stream.write(`,\n{"${key}":["${ids}"]}`)
        }
    }
    
    stream.write("] }");
    stream.close();
};