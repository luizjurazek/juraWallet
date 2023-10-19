// Seleciona o elemento HTML com o ID "cadastrar_transacao".
const cadastrar_transacao = document.getElementById("cadastrar_transacao")

// Adiciona um evento de clique ao botão de cadastro de transação.
cadastrar_transacao.addEventListener("click", (evt) => {
    // Obtém os valores dos campos de entrada no formulário.
    const nome_transacao = document.getElementById("nome_transacao").value
    const categoria_transacao = document.getElementById("category_transacao").value
    const valor_transacao = document.getElementById("valor_transacao").value
    const tipo_transacao = document.getElementById("tipo_transacao").value
    const data_transacao = document.getElementById("data_transacao").value
    console.log(tipo_transacao)

    // Cria um objeto "transacao" com os valores dos campos.
    const transacao = {
        nome: nome_transacao,
        categoria: categoria_transacao,
        valor: valor_transacao,
        tipo: tipo_transacao,
        data: data_transacao
    }

    console.log(transacao)

    // Verifica se algum campo no formulário está vazio.
    if (transacao.nome == "" || transacao.cadastrar_transacao == "" || transacao.valor == "" || transacao.tipo == "" || transacao.data == "") {
        // Se algum campo estiver vazio, exibe um alerta solicitando que todos os campos sejam preenchidos.
        alert("Preencha todos os dados")
    } else {
        // Caso contrário, todos os campos estão preenchidos.
        // Configura as opções para a solicitação POST com os dados da transação.
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token[1], // Configure o token JWT no cabeçalho
            },
            body: JSON.stringify(transacao)
        }

        // Define o endpoint da API para criar uma nova transação.
        const endpoint = "http://127.0.0.1:8080/criartransacao"

        // Realiza a solicitação POST para criar a transação.
        fetch(endpoint, requestOptions)
            .then(response => response.json()) // Analisa a resposta JSON.
            .then(data => {
                if (data.error == false) {
                    // Se a criação for bem-sucedida, exibe no console uma mensagem de sucesso com o ID da nova transação.
                    alert("Transação criada com sucesso.");
                    window.location.reload()
                } else {
                    // Se houver um erro na criação, exibe no console uma mensagem de erro com a descrição do erro.
                    console.error("Erro ao criar a transação:", data.error);
                }
            })
            .catch(error => {
                // Se ocorrer um erro na solicitação, exibe no console uma mensagem de erro com o erro ocorrido.
                console.error("Erro na solicitação:", error);
            });

        // Recarrega a página para atualizar os dados da lista de transações após a criação bem-sucedida.
        // 
    }
})