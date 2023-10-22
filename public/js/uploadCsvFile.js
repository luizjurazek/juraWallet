// // Token de autenticacao
// const regexForToken = /token=([^;]*)/;
// let token = document.cookie.match(regexForToken)

document.getElementById('csv-upload-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('csvFile', document.getElementById('csvFileInput').files[0]);
    
    const endpoint = 'http://localhost:8080/importartransacoes'
    const requestOptions = {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': token[1]
        }
    }

    fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error('Erro ao enviar arquivo: ' + error));
});