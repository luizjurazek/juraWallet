const btnFileExport = document.getElementById('btn_file_export')
const modalExport = document.getElementById('modal_export')

const btnExportAllTransacoes = document.getElementById('btn_export_all_transacoes')
const btnExportMesTransacoes = document.getElementById('btn_export_mes_transacoes')

const anoTransacaoExport = document.getElementById('ano-transacao-export')
const mesTransacaoExport = document.getElementById('mes-transacao-export')
const containerDownload = document.getElementById('containerDownload')

const btnCancelarExport = document.getElementById('btn_cancelar_export')


btnFileExport.addEventListener('click', (evt) => {
    modalExport.classList.remove('ocultar')
})

btnCancelarExport.addEventListener('click', (evt) => {
    containerDownload.innerHTML = ""
    modalExport.classList.add('ocultar')
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
                let downloadLink;
                createLinkDownload(containerDownload, downloadLink, 'a', "Clique para baixar o arquivo!", data)
            } else {
                let responseError;
                createTextErrorDownload(containerDownload, responseError, "p", data.mensagem)
            }
        })
        .catch(error => {
            console.log(error)
            let erroInterno;
            createTextErrorDownload(containerDownload, erroInterno, "p", "Houve um erro interno ao gerar o arquivo!")
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
                    let downloadLink;
                    createLinkDownload(containerDownload, downloadLink, 'a', "Clique para baixar o arquivo!", data)
                } else {

                }
            })
            .catch(error => {
                console.log(error)
                let erroInterno;
                createTextErrorDownload(containerDownload, erroInterno, "p", "Houve um erro interno ao gerar o arquivo!")
            })
    } else {
        let elementText;
        createTextErrorDownload(containerDownload, elementText, "a", "Selecione um período válido.")
    }
})


// Criar elemento de texto caso tenha um erro ao gerar o link de exportação 
let createTextErrorDownload = (container, elementoTexto, typeElement, textElment) => {
    container.innerHTML = ""
    elementoTexto = document.createElement(typeElement)
    elementoTexto.innerHTML = textElment
    container.appendChild(elementoTexto)
}

// Criar o elemento de download para baixar a exportação
let createLinkDownload = (container, elementLink, typeOfElement, textElement, data) => {
    container.innerHTML = ""
    elementLink = document.createElement(typeOfElement)
    elementLink.innerHTML = textElement
    elementLink.href = data.pathDownload;
    elementLink.setAttribute('download', data.arqName);
    container.appendChild(elementLink)
}