const fs = require('fs')
const path = require('path')

function excluirArquivosNaPasta(caminhoPasta) {
    fs.readdir(caminhoPasta, (erro, arquivos) => {
        if (erro) {
            console.error(`Houve um erro ao ler a pasta ${caminhoPasta}: ${erro}`)
            return;
        }

        arquivos.forEach((arquivo) => {
            const caminhoArquivo = path.join(caminhoPasta, arquivo)

            fs.unlink(caminhoArquivo, (erro) => {
                if (erro) {
                    console.error(`Erro ao excluir o arquivo ${caminhoArquivo}: ${erro}`);
                } else {
                    console.log(`Arquivo ${caminhoArquivo} excluído com sucesso`);
                }
            })
        })
    })
}

function gerarStringAleatoria(length) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres.charAt(randomIndex);
    }
    return resultado;
}

function separarTransacaoPorTipo(transacoes) {
    let entrada = {
        total: null,
        transacoes: []
    };
    
    let saida = {
        total: null,
        transacoes: []
    };
    let retorno = [];

    // Loop através de todas as transações
    for (let i = 0; i < transacoes.length; i++) {
        // Verifica se a transação é de entrada e atualiza a soma de entradas.
        if (transacoes[i].s_tipo_transacoes === 'entrada') {
            entrada.transacoes.push(transacoes[i])
            entrada.total += transacoes[i].i_valor_transacoes
        } else if (transacoes[i].s_tipo_transacoes === 'saida') {
            saida.transacoes.push(transacoes[i])
            saida.total += transacoes[i].i_valor_transacoes
        }
    }

    retorno.push(entrada)
    retorno.push(saida)
    return retorno;
}



module.exports = {
    gerarStringAleatoria,
    separarTransacaoPorTipo,
    excluirArquivosNaPasta
}