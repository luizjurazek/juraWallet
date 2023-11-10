const containerGraficosGeral = document.getElementById('containerGraficoGeral')
const chartMeses = document.getElementById('chartMeses');
const chartCategorias = document.getElementById('chartCategorias');

const containerGraficoMes = document.getElementById('containerGraficoMes')
const chartCategoriasDia = document.getElementById('chartCategoriasDia')
const chartDias = document.getElementById('chartDias')

const bntBuscarTransacoes = document.getElementById('buscar-transacoes')
const bntBuscarTodasTransacoes = document.getElementById('buscar-todas-transacoes');

let chartPizza;
let chartSerie;

function getStatsMes(mes, ano) {
    const endPoint = `http://localhost:8080/statscategoriapormes/${mes}/${ano}`
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token[1], // Capturar a segunda posição do array que foi extraido o token via regex
        },
    }

    fetch(endPoint, requestOptions)
        .then(res => res.json())
        .then(data => {
            const dataCategoria = data.saidaPorCategoria
            const dataSaidaMes = data.entradaSaidaDia
            gerarGraficoCategorias(dataCategoria, chartCategoriasDia)
            gerarGraficoDeSerie(dataSaidaMes, chartDias, `Gastos por dia do mês: ${mes}`, true, false)
        })
}


function getStatsAno() {
    const endPoint = 'http://127.0.0.1:8080/statsmesesdoano'
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token[1], // Capturar a segunda posição do array que foi extraido o token via regex
        },
    }


    fetch(endPoint, requestOptions)
        .then(res => res.json())
        .then(data => {
            const dataCategoriaMes = data.saidaPorCategoria
            const dataSaidaMes = data.entradaSaidaMes
            gerarGraficoCategorias(dataCategoriaMes, chartCategorias)
            gerarGraficoDeSerie(dataSaidaMes, chartMeses, 'Gastos em cada mês do ano', false, false)
        })
}

function gerarGraficoCategorias(requestData, chart) {
    delete requestData.salario;
    const chaves = Object.keys(requestData)
    const values = Object.values(requestData)
    const cores = [];
    chaves.forEach(chave => {
        const cor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        cores.push(cor)
    });

    const data = {
        labels: chaves,
        datasets: [{
            label: 'Valor',
            data: values,
            backgroundColor: cores,
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Gastos por categoria'
                }
            }
        },
    };

    if(chartPizza){
        chartPizza.destroy();
    }

    chartPizza = new Chart(chart, config)
    return chartPizza
}

function gerarGraficoDeSerie(requestData, chart, configText, displayDataSetEntradas, displayDataSetSaidas) {
    const chaves = Object.keys(requestData)
    const entradas = [];
    const saidas = []
    for (const chave of chaves) {
        const valorEntrada = requestData[chave].entrada;
        const valorSaida = requestData[chave].saida;
        saidas.push(valorSaida);
        entradas.push(valorEntrada);
    }

    const labels = chaves;
    const data = {
        labels: labels,
        datasets: [{
                label: 'Entradas',
                data: entradas,
                borderColor: "#76cc76",
                backgroundColor: "#76cc76",
                hidden: displayDataSetEntradas
            },
            {
                label: 'Saidas',
                data: saidas,
                borderColor: "#FF6961",
                backgroundColor: "#FF6961",
                hidden: displayDataSetSaidas
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'x',
            elements: {
                bar: {
                    borderWidth: 2,
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: configText
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        },
    }

    if(chartSerie){
        chartSerie.destroy();
    }

    chartSerie = new Chart(chart, config);
    return chartSerie
}

bntBuscarTodasTransacoes.addEventListener('click', (evt) => {
    containerGraficosGeral.classList.remove('ocultar')
    containerGraficoMes.classList.add('ocultar')
    getStatsAno()
})

bntBuscarTransacoes.addEventListener('click', (evt) => {
    containerGraficoMes.classList.remove('ocultar')
    containerGraficosGeral.classList.add('ocultar')

    const mesTransacao = document.getElementById('mes-transacao').value
    const anoTransacao = document.getElementById('ano-transacao').value

    getStatsMes(mesTransacao, anoTransacao)
})

window.addEventListener('load', () => {
    const date = new Date()
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    getStatsMes(currentMonth, currentYear, `Gastos por dia do mês: ${currentMonth}`)
})