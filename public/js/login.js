const btnLogin = document.getElementById("login")

btnLogin.addEventListener("click", (evt) => {
    event.preventDefault();

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    fetch('http://127.0.0.1:3000/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
        }).then(response => {
            console.log(response.status)
            if (response.status === 200) {
                // Redireciona para a página de perfil em caso de sucesso
                console.log("logado com sucesso")
            } else {
                alert('Falha na autenticação. Verifique seu nome de usuário e senha.');
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a solicitação:', error);
        });
})

// Criar o cadastro do usuário 