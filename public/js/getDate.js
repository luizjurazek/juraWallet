let time = document.querySelector('#header-placeholder .bg-menu #time span')

// console.log(time)
function addZero(i){
    if(i < 10){i = "0" + i}
    return i
}

function getHours(){
    const date = new Date()
    let hour = addZero(date.getHours())
    let minutes = addZero(date.getMinutes())
    let seconds = addZero(date.getSeconds())
    let hours = `${hour}:${minutes}:${seconds}`

    time.innerHTML = hours
    return hours
}

setInterval(getHours, 1000)






