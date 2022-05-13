
export function exceptionLoginError(display){
    const spanError = document.querySelector(".login-error").style.display=`${display}`
    return spanError
}