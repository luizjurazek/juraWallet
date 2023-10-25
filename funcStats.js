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
    let somaValorPorMes = {}
    let somaCategoriasPorMes = {}
    let dados = []

    objectTransacoes.forEach((transacao) => {
        const dataTransacao = new Date(transacao.dt_data_transacoes)
        const mes = dataTransacao.getMonth() + 1;
        const ano = dataTransacao.getFullYear();

        const chaveMes = `${ano}-${mes}`

        somaValorPorMes = (somaValorPorMes[chaveMes] || 0) + transacao.i_valor_transacoes

        if(!somaCategoriasPorMes[chaveMes]){
            somaCategoriasPorMes[chaveMes] = {};
        }

        const categoria = transacao.s_categoria_transacoes;
        somaCategoriasPorMes[chaveMes][categoria] = (somaCategoriasPorMes[chaveMes][categoria] || 0) + 1;

    })

    dados.push(somaValorPorMes, somaCategoriasPorMes)
    return dados;
}

module.exports = {
    getStatsGeral,
    getStatsMes
}
