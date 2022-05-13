import { criarCardProduto } from "../component/cardProdutos.js";
import { exceptionProdutoNaoLocalizado } from "../component/exceptionProdutoNaoLocalizado.js";
import { consultarProduto } from "../service/produto-service.js";
import { adicionarProdutoCarrinho } from "./carrinhoCompra-controller.js";

const divCard = document.createElement('div')
divCard.classList.add('card')
const main = document.querySelector('main')
main.appendChild(divCard)

const formularioBuscarProduto = document.querySelector('[data-formBusca]')

formularioBuscarProduto.addEventListener('submit', (evento)=>{
    evento.preventDefault()
    const inputDescricaoProduto = document.querySelector('[data-buscar]')
    const descricaoPesquisa = inputDescricaoProduto.value

    if (descricaoPesquisa){
        
        processarBuscadorProdutos(descricaoPesquisa)

        inputDescricaoProduto.value = ""
    }
})

export function carregarProdutoDestaque(){
    const url = 'destaque=true'
    adicionarProdutoPagina(url)

}

const menu = document.querySelectorAll('.menu')

for(var index = 0; index < menu.length ; index++){
   
    menu[index].addEventListener('click', (evento)=>{
        evento.preventDefault
        const navMenu = evento.target

        var depto = navMenu.getAttribute('data-depto')
        var fabricante = navMenu.getAttribute('data-fabricante')
        var oferta = navMenu.getAttribute('data-oferta')
        let url = ""
        
        limparPaginaCardProdutos()
        
        if(fabricante=='todas')
            url = `depto=${depto}`
        else if(oferta)
            url = `depto=${depto}&&oferta=${oferta}`
        else 
            url = `depto=${depto}&&fabricante=${fabricante}`
        
        adicionarProdutoPagina(url)
    })
}

function limparPaginaCardProdutos(){
    divCard.innerHTML = ""
}

function removerDivProdutoNaoEncontrado(){
    let div = document.querySelector('.resultado__Busca')
    if(div){
        div.remove()
    }
}


function processarBuscadorProdutos(produtoPesquisa){

    var url = ''

    if (produtoPesquisa){
        const descricao = produtoPesquisa.toUpperCase()
        consultarProduto('').then(
            data => {

                for (let index = 0 ; index < data.length ; index++){
                    const descricaoBancoDados = data[index].descricao.toUpperCase()
                    
                    if (descricaoBancoDados.includes(descricao) == true){
                        url += `id=${data[index].id}&&`
                    }            
                }

                if (url.length == 0){
                    limparPaginaCardProdutos()
                    main.appendChild(exceptionProdutoNaoLocalizado())
                }else{
                    adicionarProdutoPagina(url)

                }
            }
        )
    }
}

function adicionarProdutoPagina(url){

    const urlPesquisa = url

        limparPaginaCardProdutos()
        consultarProduto(urlPesquisa).then(

            data => {
                
                if(data.length > 0 ){

                    removerDivProdutoNaoEncontrado()

                    for (let index = 0 ; index < data.length ; index++){
                        divCard.appendChild(criarCardProduto(data[index]))
                    }

                    adicionarEventoCompra()
                    
                }
                else{
                    main.appendChild(exceptionProdutoNaoLocalizado())
                }   
            }
        )
}

function adicionarEventoCompra(){

    const formComprar = document.querySelectorAll('.card__comprar')

    for(var index = 0; index < formComprar.length ; index++){

        formComprar[index].addEventListener('submit', async (evento)=>{
            evento.preventDefault()
            
            const produtoComprado = evento.target
            const keyProduto = produtoComprado.getAttribute('data-produtokey')
            const url = `id=${keyProduto}`
            let produto = []

           const quantidade = produtoComprado.querySelector('.card__qtde').value

            await consultarProduto(url).then(
                data =>{
                    if(data){
                        produto.push(data[0])
                    }
                })            

            adicionarProdutoCarrinho(produto[0], quantidade)
            produtoComprado.querySelector('.card__qtde').value = "1"
            
            //removido aqui
        })

    }

}



carregarProdutoDestaque()
