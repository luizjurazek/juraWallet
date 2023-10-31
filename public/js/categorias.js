const regexForToken = /token=([^;]*)/;
let token = document.cookie.match(regexForToken);

const btnCriarCategoria = document.getElementById('btn_criar_categoria');

btnCriarCategoria.addEventListener('click', (evt) => {
    const regex = /^[a-zA-Z\s]+$/; // Aceita apenas letras e espaços
    const inputCategoria = document.getElementById('insertCategoria').value.toLowerCase();
    const ObjCategoria = {
        categoria: inputCategoria
    };

    const endPoint = `http://127.0.0.1:8080/insertcategoria`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token[1], // Capturar a segunda posição do array que foi extraído o token via regex
        },
        body: JSON.stringify(ObjCategoria) // Corrigindo a estrutura do corpo
    };

    if (inputCategoria.trim() !== '' && regex.test(inputCategoria)) {
        fetch(endPoint, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error)
            })
    } else {
        console.log('Campo inválido. Insira um texto válido.');
    }
});