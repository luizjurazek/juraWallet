function gerarStringAleatoria(length) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres.charAt(randomIndex);
    }
    return resultado;
}

module.exports = {
    gerarStringAleatoria
}