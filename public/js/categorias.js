const regexForToken = /token=([^;]*)/;
let token = document.cookie.match(regexForToken);

const btnCriarCategoria = document.getElementById('btn_criar_categoria');
const btnDeletarCategoria = document.getElementById('btn_delete_categoria');
const btnEditarCategoria = document.getElementById('btn_editar_categoria')


const selectDeleteCategoria = document.getElementById('selectDeleteCategoria');
const selectEditarCategoria = document.getElementById('selectEditarCategoria');

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

function getCategorias() {
    const endPoint = 'http://localhost:8080/getcategorias'
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token[1], // Configure o token JWT no cabeçalho
        }
    }

    fetch(endPoint, requestOptions)
        .then(res => res.json())
        .then(data => {
            data.forEach((el) => {
                let optionSelectCategorias = document.createElement('option')
                let optionSelectCategoriasEditar = document.createElement('option')

                optionSelectCategorias.setAttribute('value', el.s_categoria_config)
                optionSelectCategorias.innerHTML = el.s_categoria_config

                optionSelectCategoriasEditar.setAttribute('value', el.s_categoria_config)
                optionSelectCategoriasEditar.innerHTML = el.s_categoria_config

                selectDeleteCategoria.appendChild(optionSelectCategorias)
                selectEditarCategoria.appendChild(optionSelectCategoriasEditar)
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

btnDeletarCategoria.addEventListener('click', (evt) => {
    const modalExcluirCategoria = document.getElementById('modal_excluir_categoria')
    modalExcluirCategoria.classList.remove('ocultar')

    const categoriaSpan = document.getElementById('categoriaSpan')
    categoriaSpan.innerHTML = selectDeleteCategoria.value

    const btnExcluirCategoria = document.getElementById('btn_excluir_categoria')
    btnExcluirCategoria.addEventListener('click', (evt) => {
        if(selectDeleteCategoria.value != '-'){
            const categoriaExcluir = selectDeleteCategoria.value
            excluirCategoria(categoriaExcluir)
            alert('Categoria excluída com sucesso!')
            window.location.reload()
        } else {
            alert('Selecione uma categoria!')
        }
        
    })

    const btnCancelarCategoria = document.getElementById('btn_cancelar_categoria')
    btnCancelarCategoria.addEventListener('click', (evt) => {
        modalExcluirCategoria.classList.add('ocultar')
    })

})

function excluirCategoria(categoriaExcluida) {
    const endPoint = `http://localhost:8080/deletarcategoria/${categoriaExcluida}`
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token[1], // Configure o token JWT no cabeçalho
        }
    }

    fetch(endPoint, requestOptions)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

btnEditarCategoria.addEventListener('click', (evt) => {
    const categoria = selectEditarCategoria.value;
    const novaCategoria = document.getElementById('novaCategoria').value
    console.log(categoria)
    console.log(novaCategoria)
    editarCategoria(categoria, novaCategoria)
})

function editarCategoria(categoria, novaCategoria) {
    const categoriaEditada = {
        categoria: categoria,
        novaCategoria: novaCategoria
    };

    const endPoint = `http://localhost:8080/editarcategoria`
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token[1], // Configure o token JWT no cabeçalho
        },
        body: JSON.stringify(categoriaEditada)
    }

    fetch(endPoint, requestOptions)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

window.addEventListener('load', (evt) => {
    getCategorias()
})