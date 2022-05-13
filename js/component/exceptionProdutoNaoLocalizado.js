
export function exceptionProdutoNaoLocalizado(){

    let divJaExiste = document.querySelector('.resultado__Busca')
    if(divJaExiste){
        divJaExiste.remove()
    }

    const div = document.createElement('div')
    div.classList.add('resultado__Busca')
    div.textContent =  'Nenhum resultado encontrado :(' 
    
    
    return div
}
