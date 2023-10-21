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
                console.log(data)
                localStorage.setItem('usuario', data.nomeUsuario)
                document.cookie = `token=${data.autenticacao.token};expires=${data.autenticacao.expiresIn}`
                document.cookie = `user=${data.nomeUsuario};idUser=${data.autenticacao.id}`
                setTimeout(() => {
                    window.location.href = "http://localhost:8080/home"
                }, 100);
            } else {
                console.error('Erro no login:', data.mensagem);
                alert("Usuário ou senha não encontrado, tente novamente!")
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a solicitação:', error);
        });
})

// Criar o cadastro do usuário 