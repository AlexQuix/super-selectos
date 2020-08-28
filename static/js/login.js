
function initLogin(){
    let contLogin = document.getElementById("container-login");
    // MOSTRAR CONTENEDOR
    let contSign = document.querySelector(`#container-login > #cont-${contLogin.dataset.login}`)
    contSign.style.display = "grid";
    // VERIFICAR DATASET DEL CONTENEDOR PADRE
    switch(contLogin.dataset.login){
        case "signup": cheekUserSignUp();
                       cheekPasswordSignUp();
                       sendFormSingUp();
        break;
        case "signin": sendFormSingIn();
        break;
        case "informacioncuenta": viewInformationAccount();
        break;
    }
    viewPassword();
};
function sendFormSingUp(){
    let form = document.querySelector("#container-login > #cont-signup > div > form");
    let btn = document.querySelector("#container-login > #cont-signup > div > form > #btns button");
    btn.onclick = async function(e){
        e.preventDefault();
        debugger;
        if(e.target.validity.valid){
            let formdata = new FormData(form);
            let response = await fetch("http://localhost:3000/login/signup/create-user", {    
                method: "POST",
                body: formdata
            });
            let text = await response.text();
            if(text !== "err"){
                let json = JSON.parse(text);
                if(json !== undefined){
                    for(let prop in json){
                        localStorage.setItem(prop, json[prop]);
                    }
                    location.href = "http://localhost:3000/";
                }
            }
        }
    }
}
function viewInformationAccount(){
    let contInf = document.querySelector("#container-login > #cont-informacioncuenta > #container-inf > #inf");
    contInf.innerHTML = `
            <label><strong>Usuario :</strong><p>${localStorage.getItem("user")}</p></label>
            <label><strong>Contraseña :</strong><p>${localStorage.getItem("password")}</p></label>
            <label><strong>Correo :</strong><p>${localStorage.getItem("email")}</p></label>
            <label><strong>Pais :</strong><p>${localStorage.getItem("country")}</p></label>
            <label><strong>Direccion :</strong><p>${localStorage.getItem("direction")}</p></label>
            <label><strong>Dinero :</strong><p>$${localStorage.getItem("money")}</p></label>
        `;
}
function sendFormSingIn(){
    let btnSendForm = document.querySelector(`#container-login > #cont-signin > div > form > #btns button`);
    btnSendForm.onclick = async function(e){
        e.preventDefault();
        let form = document.querySelector("#container-login > #cont-signin > div > form");
        let user = document.querySelector("#container-login > #cont-signin > div > form #user");
        let password = document.querySelector("#container-login > #cont-signin > div > form #password");
        // COMPROBAR LA INFORMACION
        let response = await fetch("/login/signin/cheek-data", {
            method: "POST",
            body: `user=${user.value}&password=${password.value}`
        });
        let text = await response.text();
        try{
            let json = JSON.parse(text);
            if(json !== undefined){
                for(let prop in json){
                    localStorage.setItem(prop, json[prop]);
                }
                form.submit();
            }
        }
        catch (e){
            contAlert(false, user, "signin", text);
        }
    }
}
function cheekUserSignUp(){
    let input_user = document.querySelector("#cont-signup > div > form > #inputs #input-user");
    input_user.oninput = async function(element){
        let formdata = new FormData();
        formdata.append("user", element.target.value);
        let xhr = new XMLHttpRequest();
        xhr.onload = (e)=>{
            let mensaje = e.target.response;
            contAlert(e.target.response === "OK", input_user, "signup", mensaje)
        }
        xhr.open("POST", "http://localhost:3000/login/signup/cheek-user");
        xhr.responseType = "text";
        xhr.send(formdata);
    }
};
function cheekPasswordSignUp(){
    let password1 = document.querySelector("#cont-signup > div > form > #inputs #input-password1");
    let password2 = document.querySelector("#cont-signup > div > form > #inputs #input-password2");
    password2.oninput = (e)=>{
        let mensaje = "Las contraseñas ingresadas no coinciden entre si";
        contAlert(password1.value === password2.value, password1, "signup", mensaje);
        contAlert(password1.value === password2.value, password2, "signup", mensaje);
    }
};
function contAlert(condicional, input, login, mensaje){
    let color = ["rgb(248, 248, 248)", "rgb(221, 20, 87)"];
    let cont_alert = document.querySelector(`#container-login > #cont-${login} > div > form > #cont-alert`);
    if(condicional){
        input.setCustomValidity("");
        cont_alert.innerHTML = "";
        cont_alert.style.background = color[0];
    }else{
        input.setCustomValidity(mensaje);
        cont_alert.innerHTML = mensaje;
        cont_alert.style.background = color[1];
        setTimeout(()=>{
            cont_alert.innerHTML = "";
            cont_alert.style.background = color[0];
        }, 5000);
    }
};
function viewPassword(){
    let cont_view_password = document.querySelectorAll(".view-password");
    for(let btn_view of cont_view_password){
        btn_view.onclick = (e)=>{
            let dataset = e.currentTarget.dataset;
            let div = e.currentTarget;
            let input = div.previousElementSibling;
            if(dataset.view === "true"){
                input.type = "text";
                dataset.view = "false";
                div.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye-slash" class="svg-inline--fa fa-eye-slash fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path></svg>`;
            }else{
                input.type = "password";
                dataset.view = "true";
                div.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path></svg>`
            }
        }
    }
};

window.addEventListener("DOMContentLoaded",initLogin)