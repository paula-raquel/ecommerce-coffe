export function btnDesconectar(){
    const btnDesconectar = document.querySelector(".cabecalho__login-btn")
    btnDesconectar.style.display ="block"
    btnDesconectar.addEventListener("click", ()=>{
        localStorage.removeItem("usuario")
        document.location.reload()  //Recarregando a página do inicio ao deslogar
        
    })
    return btnDesconectar
}