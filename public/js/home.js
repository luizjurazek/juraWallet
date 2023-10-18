document.onload =  async function (e) {
    const token = document.cookie;
    const arrayToken = token.split("=")

    await fetch('/http://localhost:8080/home', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${arrayToken[1]}`, // Configure o token JWT no cabeçalho
            },
        })
        .then((response) => {
            // Processar a resposta da rota autenticada
        })
        .catch((error) => {
            // Lidar com erros, como autenticação falhada
        });
}