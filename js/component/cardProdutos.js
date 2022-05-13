
export function criarCardProduto(produto){

    const id = produto.id
    const descricao = produto.descricao
    const imagem = produto.img
    let valor = produto.valor
    const valorOferta = produto.valorOferta

    if (parseFloat(valorOferta) > 0){
        valor = `De: R$ ${valor} <br>Por: R$ ${valorOferta}`
    } else{
        valor = `R$ ${valor}`
    }
    
    const divCardBox = document.createElement('div')
    divCardBox.classList.add('card__box')

    const cardProduto = `   
                            <img class="card__imagem" src="../assets/img/produtos/${imagem}" 
                            alt="${descricao}">
                            <div class="card__descricao">${descricao}</div>
                            <div class="card__valor">${valor}</div>
                            <form class="card__comprar" data-produtokey="${id}">
                            <input class="card__qtde" type="number" name="quantidade_compra" min="1"
                                max="9999" value=1>
                            <input class="card__btn-qtde" type="submit" value="Comprar" >
                            </form>
                            `
    

    divCardBox.innerHTML = cardProduto
                        
    return divCardBox
}
