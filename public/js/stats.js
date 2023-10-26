function getStatsMeses() {
    const endPointStats = 'http://127.0.0.1:8080/statsmesesdoano'
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token[1], // Capturar a segunda posição do array que foi extraido o token via regex
        },
    }
    

    fetch(endPointStats, requestOptions)
        .then(res => res.json())
        .then(data => {

            const chaves = Object.keys(data)
            const entradas = [];
            const saidas = []
            for (const chave of chaves) {
                const valorEntrada = data[chave].entrada;
                const valorSaida = data[chave].saida;
                saidas.push(valorSaida);
                entradas.push(valorEntrada);
            }

            gerarGraficoPorMes(chaves, entradas, saidas)
        })
}

function gerarGraficoPorMes(labelChave, labelEntradas, labelSaidas) {
    const ctx = document.getElementById('myChart');

    const labels = labelChave;
    const data = {
        labels: labels,
        datasets: [{
                label: 'Entradas',
                data: labelEntradas,
                borderColor: "#76cc76",
                backgroundColor: "#76cc76",
            },
            {
                label: 'Saidas',
                data: labelSaidas,
                borderColor: "#FF6961",
                backgroundColor: "#FF6961",
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'x',
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each horizontal bar to be 2px wide
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
                    text: 'Gasto ao longo do ano:'
                }
            }
        },
    });
}

window.addEventListener('load', () => {
    getStatsMeses() 
})