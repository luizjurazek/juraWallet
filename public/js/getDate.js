let time = document.querySelector('#header-placeholder .bg-menu #time span')
const user = document.querySelector("#userName")

const userCookie = getCookie('user')
user.innerHTML = `Olá ${userCookie}`

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return null;
}

// console.log(time)
function addZero(i) {
    if (i < 10) {
        i = "0" + i
    }
    return i
}

function getHours() {
    const date = new Date()
    let hour = addZero(date.getHours())
    let minutes = addZero(date.getMinutes())
    let seconds = addZero(date.getSeconds())
    let hours = `${hour}:${minutes}:${seconds}`

    time.innerHTML = hours
    return hours
}

setInterval(getHours, 1000)