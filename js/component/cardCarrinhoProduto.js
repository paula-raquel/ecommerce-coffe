
export function criarCardProdutoCarrinho(produto, quantidade, subtotal){


    const id = produto.id
    const descricao = produto.descricao
    const imagem = produto.img
    let valor = produto.valor
    const valorOferta = produto.valorOferta
    const valorSubTotal = subtotal

    if (parseFloat(valorOferta) > 0){
        valor = `De: R$ ${valor} Por: R$ ${valorOferta}`
    } else{
        valor = `R$ ${valor}`
    }

    const divProdutoSideNav = document.createElement('div')
    divProdutoSideNav.classList.add('produto__sidenav')

    const cardProduto = `
    <img class="produto__sidenav-imagem" src="../assets/img/produtos/${imagem}"
    alt="${descricao}">
    <div class="produto__sidenav-descricao">${descricao}</div>
    <div class="produto__sidenav-valor">${valor}</div>
    <input class="produto__sidenav-quantidade" type="number" name="quantidade_compra"  min="1"
      max="9999" value=${quantidade} data-produtokeyCarrinho="${id}">
      <a href="#" class="produto__sidenav-btn" data-produtokeyCarrinhoExcluir="${id}">&times;</a>
    <div class="produto__sidenav-subtotal"> <span style="font-weight: bold;">Subtotal: </span>R$ <span class="subtotal">${valorSubTotal}</span></div>    
    `
    divProdutoSideNav.innerHTML = cardProduto

    return divProdutoSideNav
    

}



