const btnFileExport = document.getElementById('btn_file_export')
const modalExport = document.getElementById('modal_export')

const btnExportAllTransacoes = document.getElementById('btn_export_all_transacoes')
const btnExportMesTransacoes = document.getElementById('btn_export_mes_transacoes')

const anoTransacaoExport = document.getElementById('ano-transacao-export')
const mesTransacaoExport = document.getElementById('mes-transacao-export')
const containerDownload = document.getElementById('containerDownload')



btnFileExport.addEventListener('click', (evt) => {
    modalExport.classList.remove('ocultar')
})

btnExportAllTransacoes.addEventListener('click', (evt) => {
    const endpoint = 'http://localhost:8080/exportartransacoes/00/null'
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token[1]
        }
    }

    fetch(endpoint, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.error == false) {
                containerDownload.innerHTML = ""
                const downloadLink = document.createElement(`a`)
                downloadLink.innerHTML = "Clique para baixar o arquivo!"
                downloadLink.href = data.pathDownload;
                downloadLink.setAttribute('download', data.arqName);
                containerDownload.appendChild(downloadLink)
            } else {
                containerDownload.innerHTML = ""
                const responseError = document.createElement('p')
                responseError.innerHTML = data.mensagem
                containerDownload.appendChild(responseError)
            }
        })
        .catch(error => {
            containerDownload.innerHTML = ""
            const erroInterno = document.createElement('p')
            erroInterno.innerHTML = "Houve um erro interno ao gerar o arquivo!"
            containerDownload.appendChild(erroInterno)
            console.log(error)
        })
})

btnExportMesTransacoes.addEventListener('click', (evt) => {
    const mes = mesTransacaoExport.value
    const ano = anoTransacaoExport.value

    if (mes != '-' && ano != '-') {
        const endpoint = `http://localhost:8080/exportartransacoes/${mes}/${ano}`
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': token[1]
            }
        }
        fetch(endpoint, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.error == false) {
                    containerDownload.innerHTML = ""
                    const downloadLink = document.createElement(`a`)
                    downloadLink.innerHTML = "Clique para baixar o arquivo!"
                    downloadLink.href = data.pathDownload;
                    downloadLink.setAttribute('download', data.arqName);
                    containerDownload.appendChild(downloadLink)
                } else {
                    containerDownload.innerHTML = ""
                    const responseError = document.createElement('p')
                    responseError.innerHTML = data.mensagem
                    containerDownload.appendChild(responseError)
                }
            })
            .catch(error => {
                containerDownload.innerHTML = ""
                const erroInterno = document.createElement('p')
                erroInterno.innerHTML = "Houve um erro interno ao gerar o arquivo!"
                containerDownload.appendChild(erroInterno)
                console.log(error)
            })
    } else {
        containerDownload.innerHTML = ""
        const selectInput = document.createElement('p')
        selectInput.innerHTML = "Selecione um período válido."
        containerDownload.appendChild(selectInput)
    }




})