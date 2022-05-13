
import { exceptionLoginError } from "../component/exceptionErrorSpan-login.js"
import { loginRealizado } from "../controller/loginUsuario-controller.js"


export function consultarCliente(nome,senha){

    const url = `http://localhost:3000/cliente?nome=${nome.value}&&senha=${senha.value}`

    const options = {
        method: 'GET',
        mode: 'cors',
        headers:{
            'content-type': 'application/json;charset=utf-8'
        }
    }

    return fetch(url,options).then(
        response => {
            if(response.ok){
                return response.json()
            }else {
                throw new Error('Não foi possível listar os clientes ')
            }
        }
    )



}   
