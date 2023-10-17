const teclasNum = [...document.querySelectorAll(".num")]
const teclasOp = [...document.querySelectorAll(".op")]
const teclaRes = document.querySelector(".res")
const teclaOn = document.querySelector("#t-on")
const teclaClear = document.querySelector("#t-clear")
const display = document.querySelector("#display")
const teclaResultado = document.getElementById("tigual")
const teclaCopy = document.getElementById("t-cpy")
const calc = document.getElementById("calc")
const calc_aba = document.getElementById("calc_aba")
const img_aba_calc = document.getElementById("img_aba_calc")
const body = document.getElementById("body")

let sinal = false
let decimal = false

teclasNum.forEach((el) => {
    el.addEventListener("click", (evt) =>{
        decimal = false
        if(evt.target.innerHTML == ","){
            if(!decimal){
                decimal = true
                if(display.innerHTML == "0"){
                    display.innerHTML = "0."
                } else if(evt.target.innerHTML == ","){
                    display.innerHTML += "."
                }
                
                else {
                    display.innerHTML += evt.target.innerHTML
                }
            }
        } else {
            if(display.innerHTML == "0"){
                display.innerHTML = ""
            }
            display.innerHTML+=evt.target.innerHTML
        }
    })
})

teclasOp.forEach((el) => {
    el.addEventListener("click", (evt) =>{
        if(!decimal && !sinal){
                sinal = true
                decimal = true
                
                if(display.innerHTML == "0"){
                    display.innerHTML = ""
                }
                if(evt.target.innerHTML == "x"){
                    display.innerHTML += "*"
                } else {    
                    display.innerHTML += evt.target.innerHTML
                }
        } 


        
    })
})

teclaClear.addEventListener("click", (evt)=> {
    decimal = false
    sinal = false
    display.innerHTML = "0"
})

teclaResultado.addEventListener("click", (evt)=> {
    decimal = false
    sinal = false
    const res =  eval(display.innerHTML)
    console.log(res)
    display.innerHTML = res
})

teclaCopy.addEventListener("click", (evt)=>{
    navigator.clipboard.writeText(display.innerHTML)
})

calc_aba.addEventListener("click", (evt)=> {
    calc.classList.toggle("calc_exibir")
    if(calc.classList.contains("calc_exibir")){
        evt.target.setAttribute("src", "assets/icons/arrow_right.svg")
    } else {
        evt.target.setAttribute("src", "assets/icons/arrow_left.svg")
    }
})

