
export function consultarProduto(parametro){

    const url = `http://localhost:3000/produto?${parametro}`
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
                throw new Error('Não foi possível listar os produtos ')
            }
        }
    )

}   

