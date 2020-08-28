function initMenu(){
    informationAcoout();
    let btnHome = document.querySelector("#cont-menu > #home");
    btnHome.onclick = ()=>{
        location.href = "http://localhost:3000/";
    }
    serchKeyWord();
    visibleOptMenuBtn()
}


function visibleOptMenuBtn(){
    let body = document.querySelector("body");
    let contOptMenu = document.querySelector("#container-opt-menu");
    let btnClose = document.querySelector("#container-opt-menu > #btn-close");
    let btnOptMenu = document.querySelector("#cont-menu > #menu");
    btnOptMenu.onclick = ()=>{
        if(btnOptMenu.dataset.opt === "true"){
            body.style.overflowY = "hidden";
            contOptMenu.style.display = "grid";
            btnOptMenu.dataset.opt = "false";
        }
        btnClose.onclick = ()=>{
            body.style.overflowY = "visible";
            contOptMenu.style.display = "none";
            btnOptMenu.dataset.opt = "true";
        }
    }
}

function addContKeyWord(json){
    let contKeyWord = document.querySelector("#cont-menu > #buscar > #search-result");
    contKeyWord.innerHTML += `
        <a href="/product/clasification/serch?id=${json["id"]}">${json["key word"]}</a>
    `;
}

function serchKeyWord(){
    let input = document.querySelector("#cont-menu > #buscar > #buscar-search > input")
    input.oninput = async function(e){
        let contKeyWord = document.querySelector("#cont-menu > #buscar > #search-result");
        contKeyWord.innerHTML = "";
        let btnSerch = document.querySelector("#cont-menu > #buscar > #buscar-search > #btn-serch");
        
        /* BUSCAR KEYWORD */
        let serchWord = e.target.value;
        if(serchWord !== ""){
            let response = await fetch("/post/product/serch-keyword",{
                method: "POST",
                body: `word=${serchWord}`
            });
            let text = await response.text();
            let json = JSON.parse(text);
            btnSerch.href = `/product/clasification/serch?id=${json[0].id}`;
            for(let element of json){
                addContKeyWord(element);
            }
        }
    }
}
function visibleBox(){
    let btn = document.querySelector("#cont-menu > #user");
    btn.onclick = (e)=>{
        let box = document.querySelector("#cont-menu > #user > #opt-user");
        if(box.dataset.visible == "false"){
            box.style.overflow = "visible";
            box.dataset.visible = "true";
        }else{
            box.style.overflow = "hidden";
            box.dataset.visible = "false";
        }
    }
}
function informationAcoout(){
    let btn = document.querySelector("#cont-menu > #user");
    if(localStorage.getItem("user")){
        btn.onclick = (e)=>{
            if(localStorage.getItem("user")){
                location.replace("http://localhost:3000/login/informacioncuenta");
            }else{
                visibleBox();
            }
        }
    }else{
        visibleBox();
    }
}

function addMessageMenu(name){
    let contMessage = document.querySelector("#cont-menu > #container-message");
    contMessage.innerHTML = `Has agregado un producto a tu carrito`;
    setTimeout(()=>{
        contMessage.innerHTML = "";
    }, 1000);
}
window.onload = initMenu();