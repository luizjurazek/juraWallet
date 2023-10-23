const btn_logout = document.getElementById("btn_logout")
const popup_logout = document.getElementById("popup_logout")
const btn_cancelar_logout = document.getElementById("btn_cancelar_logout")

popup_logout.addEventListener("click", (evt) => {
    const modal_logout = document.getElementById("modal_logout")
    modal_logout.classList.remove("ocultar")
})

btn_cancelar_logout.addEventListener("click", (evt) => {
    modal_logout.classList.add("ocultar")
})

btn_logout.addEventListener("click", (evt) => {
    document.cookie = "token" + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = "user" + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = '/logout'
    window.location.href = '/'
})