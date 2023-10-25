function getStatsGeral(objectTransacoes){
    const transacoesPorCategoria = {};
    const somasPorCategoriaETipo = {};

    objectTransacoes.forEach((transacao) => {
        const categoria = transacao.s_categoria_transacoes;

        if (!transacoesPorCategoria[categoria]) {
            transacoesPorCategoria[categoria] = []
        }

        transacoesPorCategoria[categoria].push(transacao)
    })

    for (const categoria in transacoesPorCategoria) {
        somasPorCategoriaETipo[categoria] = {
            entrada: 0,
            saida: 0,
        }

        transacoesPorCategoria[categoria].forEach((transacao) => {
            const tipo = transacao.s_tipo_transacoes;
            const valor = transacao.i_valor_transacoes

            if (tipo === 'entrada') {
                somasPorCategoriaETipo[categoria].entrada += valor;
            } else if (tipo === 'saida') {
                somasPorCategoriaETipo[categoria].saida += valor;
            }
        })
    }

    return somasPorCategoriaETipo
}

function getStatsMes(objectTransacoes){
    let totaisPorMes = {}

    objectTransacoes.forEach((transacao) => {
        const dataTransacao = new Date(transacao.dt_data_transacoes);
        const mes = dataTransacao.getMonth() + 1;
        const ano = dataTransacao.getFullYear();

        const chaveMes = `${ano}-${mes}`;

        if(!totaisPorMes[chaveMes]){
            totaisPorMes[chaveMes] = {
                entrada: 0,
                saida: 0,
            };
        }

        if(transacao.s_tipo_transacoes === 'entrada'){
            totaisPorMes[chaveMes].entrada += transacao.i_valor_transacoes;
        } else if (transacao.s_tipo_transacoes === 'saida'){
            totaisPorMes[chaveMes].saida += transacao.i_valor_transacoes;
        }
    })

    return totaisPorMes
}

module.exports = {
    getStatsGeral,
    getStatsMes
}
