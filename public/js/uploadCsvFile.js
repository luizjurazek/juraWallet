const btn_file_input = document.getElementById("btn_file_input")
const btn_cancelar = document.querySelector("#btn_cancelar_upload")
const modal_upload_massivo = document.querySelector("#modal_upload_massivo")

btn_file_input.addEventListener('click', (evt) => {
    modal_upload_massivo.classList.remove("ocultar")
})

btn_cancelar.addEventListener("click", (evt) => {
    modal_upload_massivo.classList.add("ocultar")
})

document.getElementById('btn_file_upload').addEventListener('click', function (event) {
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
            if(data.error == true){
                alert(data.message)
            }
            else {
                alert("Transações cadastradas com sucesso!")
                window.location.reload()
            }
        })
        .catch(error => console.error('Erro ao enviar arquivo: ' + error));
});

