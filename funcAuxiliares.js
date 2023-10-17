function gerarStringAleatoria(length) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres.charAt(randomIndex);
    }
    return resultado;
}

function separarTransacaoPorTipo(transacoes){
    let entrada = [];
    let saida = []; 
    let retorno = [];

    // Loop através de todas as transações
    for (let i = 0; i < transacoes.length; i++) {
        // Verifica se a transação é de entrada e atualiza a soma de entradas.
        if (transacoes[i].s_tipo_transacoes === 'entrada') {
            entrada.push(transacoes[i])
        } else if (transacoes[i].s_tipo_transacoes === 'saida') {
            saida.push(transacoes[i])
        }
    }

    retorno.push(entrada)
    retorno.push(saida)

    return retorno;
}

module.exports = {
    gerarStringAleatoria,
    separarTransacaoPorTipo
}

// [
//     {
//       id_transacoes: 86,
//       s_nome_transacoes: 'Luiz do pão',
//       s_categoria_transacoes: 'categoria teste',
//       i_valor_transacoes: 10,
//       s_tipo_transacoes: 'entrada',
//       dt_data_transacoes: 2023-12-18T03:00:00.000Z
//     },
//     {
//       id_transacoes: 85,
//       s_nome_transacoes: 'Jorge do pão',
//       s_categoria_transacoes: 'categoria teste',
//       i_valor_transacoes: 10,
//       s_tipo_transacoes: 'entrada',
//       dt_data_transacoes: 2023-12-18T03:00:00.000Z
//     }
//   ]