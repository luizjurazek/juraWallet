const btn_cadastro = document.getElementById("btn_cadastro");

btn_cadastro.addEventListener('click', (evt) => {
    const nome = document.getElementById("nome").value;
    const nomeDeUsuario = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    const endpoint = 'http://localhost:8080/cadastrar'
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: nomeDeUsuario,
            password: senha,
            email:  email,
            name: nome
        })
    }

    fetch(endpoint, requestOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    
})