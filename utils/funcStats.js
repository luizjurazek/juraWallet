function entradaSaidaPorMes(objectTransacoes) {
    let totaisPorMes = {}

    objectTransacoes.forEach((transacao) => {
        const dataTransacao = new Date(transacao.dt_data_transacoes);
        const mes = dataTransacao.getMonth() + 1;
        const ano = dataTransacao.getFullYear();

        const chaveMes = `${ano}-${mes}`;

        if (!totaisPorMes[chaveMes]) {
            totaisPorMes[chaveMes] = {
                entrada: 0,
                saida: 0,
            };
        }

        if (transacao.s_tipo_transacoes === 'entrada') {
            totaisPorMes[chaveMes].entrada += transacao.i_valor_transacoes;
        } else if (transacao.s_tipo_transacoes === 'saida') {
            totaisPorMes[chaveMes].saida += transacao.i_valor_transacoes;
        }
    })

    return totaisPorMes
}

function entradaSaidaPorDia(objectTransacoes) {
    let totaisPorMes = {}
    objectTransacoes.forEach((transacao) => {
        const dataTransacao = new Date(transacao.dt_data_transacoes);
        const mes = dataTransacao.getMonth() + 1;
        const dia = dataTransacao.getDate();

        const chaveMes = `${mes}-${dia}`;
        if (!totaisPorMes[chaveMes]) {
            totaisPorMes[chaveMes] = {
                entrada: 0,
                saida: 0,
            };
        }

        if (transacao.s_tipo_transacoes === 'entrada') {
            totaisPorMes[chaveMes].entrada += transacao.i_valor_transacoes;
        } else if (transacao.s_tipo_transacoes === 'saida') {
            totaisPorMes[chaveMes].saida += transacao.i_valor_transacoes;
        }
    })

    return totaisPorMes
}



function somaCategoria(objectTransacoes) {
    const somaPorCategoria = {};

    objectTransacoes.forEach((transacao) => {
        const categoria = transacao.s_categoria_transacoes;
        const valor = transacao.i_valor_transacoes;

        if (somaPorCategoria[categoria]) {
            somaPorCategoria[categoria] += valor;
        } else {
            somaPorCategoria[categoria] = valor;
        }
    });

    return somaPorCategoria;
}

module.exports = {
    entradaSaidaPorMes,
    somaCategoria,
    entradaSaidaPorDia
}