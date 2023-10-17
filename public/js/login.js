const btnLogin = document.getElementById("login")

btnLogin.addEventListener("click", (evt) => {
    event.preventDefault();

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    fetch('http://127.0.0.1:8080/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            }),
        }).then(response => response.json())
        .then(data => {
            if (data.error == false) {
                localStorage.setItem('token', data.token)
                console.log('Token capturado:', data.token);
            } else {
                console.error('Erro no login:', data.mensagem);
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a solicitação:', error);
        });
})

// Criar o cadastro do usuário 