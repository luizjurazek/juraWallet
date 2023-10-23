const logout = document.getElementById("logout")

logout.addEventListener("click", (evt) => {
    document.cookie = "token" + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = "user" + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = '/logout'
    window.location.href = '/'
})