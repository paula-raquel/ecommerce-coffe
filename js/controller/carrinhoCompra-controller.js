import { criarCardProdutoCarrinho } from "../component/cardCarrinhoProduto.js"
import { consultarProduto } from "../service/produto-service.js"


const buttonCarrinhoCompra = document.querySelector('.cabecalho__totalCarrinho')

const corpoCarrinho = document.querySelector('.container-produtosidenav')
const buttonLimparCarrinho = document.querySelector('.limpar-carrinho')
const buttonFecharCarrinho = document.querySelector('.fechar-carrinho')

const totalCarrinhoIcone = document.querySelector('.cabecalho__totalCarrinho-valor')
const totalCarrinhoPedido = document.querySelector('.total')


buttonLimparCarrinho.addEventListener('click',(evento)=>{
    limparCorpoCarrinho()
    localStorage.removeItem('coffeexpress');
    totalCarrinhoIcone.textContent = "R$ 0,00"
    totalCarrinhoPedido.textContent = "R$ 0,00"
})

buttonCarrinhoCompra.addEventListener('click', async (evento)=>{
    limparCorpoCarrinho()
    let produtosLocal = listarProdutoCarrinhoLocal()

    for (var itens in produtosLocal){
        const url = `id=${produtosLocal[itens].id}`
        await consultarProduto(url).then(
            data =>{
                if(data){
                    const subtotal = calcularSubTotalItem(data[0],produtosLocal[itens].qtde)
                    corpoCarrinho.appendChild(criarCardProdutoCarrinho(data[0], produtosLocal[itens].qtde, subtotal))    
                }
                
                const btnExcluirItemCarrinho = document.querySelectorAll('.produto__sidenav-btn')
                btnExcluirItemCarrinho[itens].addEventListener('click',(evento)=>{
                    excluirItemCarrinho(evento.target)
                })

                const inputQtdeItemCarrinho = document.querySelectorAll('.produto__sidenav-quantidade')
                inputQtdeItemCarrinho[itens].addEventListener('blur', (evento)=>{
                    edicaoQtdeCarrinhoCompra(evento.target)
                })
            }
        )
    }
})


export function adicionarProdutoCarrinho(produto, quantidade){

    const cardProdutoCompra = document.querySelectorAll('[data-produtokeyCarrinho]')
    const subtotal = document.querySelectorAll('.subtotal')            

    const produtoExistente = listarProdutoCarrinhoLocal()
    const validacaoJaExisteNoCarrrinho = produtoExistente.find(elemento => elemento.id == produto.id)

    if(validacaoJaExisteNoCarrrinho){
        for(var index = 0; index < cardProdutoCompra.length ; index++){

            if(cardProdutoCompra[index].getAttribute("data-produtokeyCarrinho") == produto.id){   

                let qtdeAtualizada = parseInt(cardProdutoCompra[index].value) + parseInt (quantidade)
                cardProdutoCompra[index].value = qtdeAtualizada.toString()

                const valorSubtotalAtualizado = calcularSubTotalItem(produto, qtdeAtualizada)
                subtotal[index].textContent = valorSubtotalAtualizado
            }
       }
   
    }else{
        let subtotal = calcularSubTotalItem(produto, quantidade)
        corpoCarrinho.appendChild(criarCardProdutoCarrinho(produto, quantidade, subtotal))
        
        const btnExcluirItemCarrinho = document.querySelectorAll('.produto__sidenav-btn')
        const inputQtdeItemCarrinho = document.querySelectorAll('.produto__sidenav-quantidade')

        const ultimoIndexExcluir = btnExcluirItemCarrinho.length - 1
        const ultimoIndexQtde = inputQtdeItemCarrinho.length - 1

        
        btnExcluirItemCarrinho[ultimoIndexExcluir].addEventListener('click',(evento)=>{
            excluirItemCarrinho(evento.target)
        })
        
        inputQtdeItemCarrinho[ultimoIndexQtde].addEventListener('blur', (evento)=>{
            edicaoQtdeCarrinhoCompra(evento.target)
        })  
        
    }

    adicionarCarrinhoLocalStorage(produto, quantidade)
    calcularTotalCarrinho() 

 
}

function adicionarCarrinhoLocalStorage(produto, quantidade){
    
    let listaDeProdutoCarrinho = listarProdutoCarrinhoLocal()

    let produtoLocal = {
        "id": produto.id,
        "qtde" : quantidade,
    }

    const produtoEhExistente = listaDeProdutoCarrinho.find(elemento => elemento.id === produtoLocal.id) 

    if(produtoEhExistente){
        let indexItemLista = retornandoIndexOfListaProdutoLocal(produtoEhExistente) 

        const qtdeAtualizada = parseInt(listaDeProdutoCarrinho[indexItemLista].qtde) + parseInt(produtoLocal.qtde)
        listaDeProdutoCarrinho[indexItemLista].qtde = qtdeAtualizada.toString()

        atualizandoListaProdutoLocal(listaDeProdutoCarrinho)


    }else{
        listaDeProdutoCarrinho.push(produtoLocal)
        atualizandoListaProdutoLocal(listaDeProdutoCarrinho)
    }

}


function excluirItemCarrinho(evento){
    var divPaiCardItemAhSerExcluido = evento.closest('div div div')
    const produtoKey = evento.getAttribute('data-produtokeyCarrinhoExcluir')

    let itens = listarProdutoCarrinhoLocal()
    itens.splice(itens.findIndex(elemento => elemento.id == produtoKey), 1)

    divPaiCardItemAhSerExcluido.remove()
    atualizandoListaProdutoLocal(itens)
    calcularTotalCarrinho()

    if(itens.length == 0){
        totalCarrinhoIcone.textContent = "0,00"
        totalCarrinhoPedido.textContent = "0,00"    
    }

}

function edicaoQtdeCarrinhoCompra(evento){

    const produtoKey = evento.getAttribute('data-produtokeycarrinho')
    const qtdeModificada = evento.value

    const produtosLocal = listarProdutoCarrinhoLocal()
    const produtoSelecionado = produtosLocal.find(elemento => elemento.id == produtoKey)
    const indexItemLista = retornandoIndexOfListaProdutoLocal(produtoSelecionado)

    const url = `id=${produtoKey}`
    const subtotal = document.querySelectorAll('.subtotal') 

    const resultadoModificacao = qtdeModificada != produtoSelecionado.qtde ? 'mudou' : 'igual'

    switch (resultadoModificacao) {
        case 'mudou':
            consultarProduto(url).then(
                data =>{
                        if(data){
                            const valorSubtotalAtualizado = calcularSubTotalItem(data[0], qtdeModificada)
                            subtotal[indexItemLista].textContent = valorSubtotalAtualizado
                        }
                }
            )
            
            produtosLocal[indexItemLista].qtde = qtdeModificada
            atualizandoListaProdutoLocal(produtosLocal)
            calcularTotalCarrinho()
            
            break;
            
        default:

            break;
    }     
}

function listarProdutoCarrinhoLocal(){
    const itens = JSON.parse(localStorage.getItem("coffeexpress")) || []
    return itens
}

function retornandoIndexOfListaProdutoLocal(produto){
    const produtos = listarProdutoCarrinhoLocal()
    const index =  produtos.findIndex(elemento => elemento.id == produto.id)    
    return index
}

function atualizandoListaProdutoLocal(lista){
    localStorage.setItem("coffeexpress",JSON.stringify(lista))
}

function calcularSubTotalItem(produto, quantidade){

    let valor = 0

    if(parseFloat(produto.valorOferta) > 0){
        valor = produto.valorOferta
    }else{
        valor = produto.valor
    }
    
    
    const valorRecebido =  valor.replace(',','.')
    const quantidadeRecebida = parseFloat(quantidade)
    
    let soma = (valorRecebido * quantidadeRecebida).toFixed(2)
    
    const subtotal = soma.toString().replace('.',',')
    

    return subtotal
}

function calcularTotalCarrinho(){
    
    const produtosLocal = listarProdutoCarrinhoLocal()
    let total = 0.00
    const totalCarrinhoIcone = document.querySelector('.cabecalho__totalCarrinho-valor')
    const totalCarrinhoPedido = document.querySelector('.total')

    for(var index in produtosLocal){
        const url = `id=${produtosLocal[index].id}`
        const qtde = produtosLocal[index].qtde

        consultarProduto(url).then(
            data =>{
                    if(data){
                        const subtotal = calcularSubTotalItem(data[0], qtde)
                        const subtotalFormatado = subtotal.replace(",",".")

                        total += parseFloat(subtotalFormatado)
                        const totalFormatado = `R$ ${total.toFixed(2).replace(".",",")}` 
                        
                        totalCarrinhoIcone.textContent = totalFormatado
                        totalCarrinhoPedido.textContent = totalFormatado

                    }
            })
    }
      

}

function limparCorpoCarrinho(){
    return corpoCarrinho.innerHTML = ""
}


calcularTotalCarrinho()
