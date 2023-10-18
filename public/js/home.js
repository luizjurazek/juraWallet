// Função para obter todas as transações e atualizar a interface do usuário
let token = document.cookie.split('=')
console.log(token[1])
function getTransacoes() {
    fetch('http://127.0.0.1:8080/listartodastransacoes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token[1], // Configure o token JWT no cabeçalho
            },
        })
        .then(res => res.json())
        .then(data => {

            console.log(data.transacoes)
        }).catch(error => {
            console.log("Erro na API: " + error)
        })
}

window.addEventListener('load', getTransacoes)