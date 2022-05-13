import { btnDesconectar } from "../component/btnDesconectar-login.js"
import { exceptionLoginError } from "../component/exceptionErrorSpan-login.js"
import { consultarCliente } from "../service/loginUsuario-service.js"


const formularioLogin = document.querySelector('[data-form]')
const nomeLogin = document.querySelector(".cabecalho__login-texto")
const dadosUsuario =  JSON.parse(localStorage.getItem("usuario"))

if (dadosUsuario){
    nomeLogin.textContent = dadosUsuario.nome
    btnDesconectar()
}

formularioLogin.addEventListener('submit', async (evento)=>{
    evento.preventDefault()

    const nome = document.querySelector('[data-nome]')
    const senha = document.querySelector('[data-senha')
 
    try {
        const data = await consultarCliente(nome,senha)

        if (data[0]){
            loginRealizado(data)
        }else{
            exceptionLoginError("block")
        }
       
        nome.value = ""
        senha.value = ""

    } catch (error) {
        console.log(error)
        window.location.href = 'view/error_pagina.html'
    }



})


export function loginRealizado(elemento){

    const dadosUsuario = {
        "id": elemento[0].id,
        "nome": elemento[0].nome.toUpperCase()
    }

    localStorage.setItem("usuario", JSON.stringify(dadosUsuario) )

    exceptionLoginError("none") 
    document.querySelector('#form-login').style.display='none'

    nomeLogin.textContent = elemento[0].nome.toUpperCase() //Alterar para pegar do objeto dadosUsuario
    btnDesconectar() 

}

