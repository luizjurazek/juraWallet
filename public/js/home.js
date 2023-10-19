// Função para obter todas as transações e atualizar a interface do usuário
let token = document.cookie.split('=')
const entradasEl = document.querySelector("#entradas p")
const saidasEl = document.querySelector("#saidas p")
const saldoEl = document.querySelector("#saldo p")
const transacoesItens = document.querySelector("#transacoes")

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
            console.log(data.entradas.total)
            entradasEl.innerHTML = "R$ " + data.entradas.total.toFixed(2)
            saidasEl.innerHTML = "R$ " + data.saidas.total.toFixed(2)
            saldoEl.innerHTML = "R$ " + (data.entradas.total - data.saidas.total).toFixed(2)
            allTransacoes(data.transacoes, transacoesItens)

        }).catch(error => {
            console.log("Erro na API: " + error)
        })
}



function deleteTransacao(id, elToRemove) {
    // Define o ID da transação a ser excluída e o endpoint da API para exclusão.
    let idDelete = id

    // Realiza uma solicitação DELETE para excluir a transação.
    fetch(`http://127.0.0.1:8080/deletartransacao/${idDelete}`,{
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token[1], // Configure o token JWT no cabeçalho
            },
    })
        .then(res => res.json())
        .then(data => {
            if (data.error == false) {
                document.getElementById("excluirItemContainer").classList.add("ocultar")
                elToRemove.remove()
                alert("Transação excluída com sucesso!")
                window.location.reload()
            }
            if (data.success == true) {
                alert("Houve um erro ao deletar a transação, tente novamente!")
            }
        }).catch(error => {
            console.log("Error" + error)
        })
}


function editarTransacaoFunc(idTransacao, nomeTransacao, categoriaTransacao, valorTransacao, tipoTransacao, dataTransacao) {
    // Cria um objeto com os dados da transação a ser editada.
    const transacaoEditada = {
        id: idTransacao,
        nome: nomeTransacao,
        categoria: categoriaTransacao,
        valor: valorTransacao,
        tipoTransacao: tipoTransacao,
        data: dataTransacao
    }

    // Configura as opções para a solicitação POST.
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token[1], // Configure o token JWT no cabeçalho
        },
        body: JSON.stringify(transacaoEditada)
    }

    // Define o endpoint da API.
    const endpoint = "http://127.0.0.1:8080/editartransacao"

    // Realiza a solicitação POST para editar a transação.
    fetch(endpoint, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.success == true) {
                // Se a edição for bem-sucedida, oculta o elemento de edição e mostra um alerta.
                document.getElementById("editarTransacao").classList.add("ocultar")
                alert(`A transação de id ${transacaoEditada.id} e nome ${transacaoEditada.nome} foi editada com sucesso!`)
                window.location.reload()
            } else if (data.success == false) {
                // Se a edição falhar, exibe um alerta de erro.
                alert(`Houve um erro ao editar a transação de id ${transacaoEditada.id} e nome ${transacaoEditada.nome}, tente novamente!`)
            }
        })
}



function allTransacoes(transacoes, elToAppend) {
    for (let i = 0; i < transacoes.length; i++) {
        // Dados da transacao 
        let idTransacao = transacoes[i].id_transacoes;
        let nomeTransacao = transacoes[i].s_nome_transacoes;
        let valorTransacao = transacoes[i].i_valor_transacoes;
        let categoriaTransacao = transacoes[i].s_categoria_transacoes;
        let tipoTransacao = transacoes[i].s_tipo_transacoes;
        let fullDataTransacao = transacoes[i].dt_data_transacoes;

        // Formatando a fullDataTransacao para dia/mes/ano
        const dataString = fullDataTransacao
        const dataObjeto = new Date(dataString)
        // Extraia o ano, mês e dia da data
        let ano = dataObjeto.getFullYear();
        let mes = (dataObjeto.getMonth() + 1).toString().padStart(2, '0'); // O mês é base 0, então somamos 1
        let dia = dataObjeto.getDate().toString().padStart(2, '0');

        // Crie a data formatada no formato "AAAA-MM-DD"
        let dataTransacaoFormatada = `${mes}/${dia}/${ano}`;


        const transacaoLinha = document.createElement("div")
        transacaoLinha.setAttribute("class", "transacoes-item")
        transacaoLinha.setAttribute("id", idTransacao)

        const nomeElement = document.createElement("div")
        nomeElement.setAttribute("class", "item")
        nomeElement.innerHTML = nomeTransacao;

        const categoriaElement = document.createElement("div")
        categoriaElement.setAttribute("class", "item")
        categoriaElement.innerHTML = categoriaTransacao;

        const valorElement = document.createElement("div")
        valorElement.innerHTML = "R$ " + valorTransacao.toFixed(2);
        if (tipoTransacao == "saida") {
            valorElement.setAttribute("class", "item saida")
        } else {
            valorElement.setAttribute("class", "item")
        }


        const tipoElement = document.createElement("div")
        tipoElement.setAttribute("class", "item")
        tipoElement.innerHTML = tipoTransacao;

        const dataElement = document.createElement("div")
        dataElement.setAttribute("class", "item")

        dataElement.innerHTML = dataTransacaoFormatada;

        const deleteIcon = document.createElement("img")
        deleteIcon.setAttribute("class", "btnDelete")
        deleteIcon.setAttribute("src", "../assets/icons/delete.svg")
        deleteIcon.addEventListener("click", (evt) => {

            const modalDelete = document.getElementById("excluirItemContainer")
            const btn_excluir = document.getElementById("btn_excluir")
            const btn_cancelar = document.getElementById("btn_cancelar")

            const modalItemNome = document.getElementById("modalItemNome").innerHTML = "Item: " + nomeTransacao;
            const modalItemCategoria = document.getElementById("modalItemCategoria").innerHTML = "Categoria: " + categoriaTransacao;
            const modalItemValor = document.getElementById("modalItemValor").innerHTML = "Valor: R$ " + valorTransacao.toFixed(2);
            const modalItemTipo = document.getElementById("modalItemTipo").innerHTML = "Tipo: " + tipoTransacao;
            const modalItemData = document.getElementById("modalItemData").innerHTML = "Data: " + dataTransacaoFormatada;


            const linhaPararemover = evt.target.parentNode.parentNode
            modalDelete.classList.remove("ocultar")

            btn_excluir.addEventListener("click", () => {
                deleteTransacao(idTransacao, linhaPararemover)
            })

            btn_cancelar.addEventListener("click", () => {
                modalDelete.classList.add("ocultar")
            })

        })

        const editIcon = document.createElement("img")
        editIcon.setAttribute("class", "btnEdit")
        editIcon.setAttribute("src", "../assets/icons/edit.svg")
        editIcon.addEventListener("click", (evt) => {
            // const editarTransacao = document.getElementById("editarTransacao");
            // const btn_cancelar_edicao = document.getElementById("btn_cancelar_edicao");
            // document.getElementById("nome_transacao_editar").value = nomeTransacao;
            // document.getElementById("category_transacao_editar").value = categoriaTransacao;
            // document.getElementById("valor_transacao_editar").value = valorTransacao.toFixed(2);
            // document.getElementById("tipo_transacao_editar").value = tipoTransacao;
            // document.getElementById("data_transacao_editar").value = `${ano}-${mes}-${dia}`


            // editarTransacao.classList.remove("ocultar");

            // btn_editar_transacao.addEventListener("click", (evt) => {
            //     const idTransacaoEditada = idTransacao
            //     const nomeEditado = document.getElementById("nome_transacao_editar").value
            //     const categoriaEditada = document.getElementById("category_transacao_editar").value
            //     const valorEditado = document.getElementById("valor_transacao_editar").value
            //     const tipoEditado = document.getElementById("tipo_transacao_editar").value
            //     const dataEditada = document.getElementById("data_transacao_editar").value

            //     editarTransacaoFunc(idTransacaoEditada, nomeEditado, categoriaEditada, valorEditado, tipoEditado, dataEditada)
            // })

            // btn_cancelar_edicao.addEventListener("click", (evt) => {
            //     editarTransacao.classList.add("ocultar");
            // });
        });

        const buttonItem = document.createElement("div")
        buttonItem.setAttribute("class", "item acoes")
        buttonItem.append(editIcon, deleteIcon)

        transacaoLinha.append(nomeElement, categoriaElement, valorElement, tipoElement, dataElement, buttonItem)
        elToAppend.appendChild(transacaoLinha)
    }
}


window.addEventListener('load', getTransacoes)