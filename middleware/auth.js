const jwt = require('jsonwebtoken')
const {
    promisify
} = require('util')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    eAdmin: async function (req, res, next) {
        const tokenTeste = req.cookies.token;
        const headerAuthorization = req.headers.authorization;

        let authHeader;

        if (tokenTeste) {
            authHeader = tokenTeste;
        } else if (headerAuthorization) {
            authHeader = headerAuthorization;
        }


        if (!authHeader) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: necessário realizar o login para acessar a página! Falta token A"
            });
        }

        const token = authHeader
        if (!token) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: necessário realizar o login para acessar a página! Falta o token B"
            });
        }

        try {
            const decode = await promisify(jwt.verify)(token, JWT_SECRET)
            req.userId = decode.id
            return next()
        } catch (err) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: necessário realizar o login para acessar a página! Token inválido"
            });
        }
    },
    logout: async function (req, res) {
        const tokenTeste = req.cookies.token;
        const headerAuthorization = req.headers.authorization;

        let authHeader;

        if (tokenTeste) {
            authHeader = tokenTeste;
        } else if (headerAuthorization) {
            authHeader = headerAuthorization;
        }

        if (!authHeader) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: necessário realizar o login para acessar a página! Falta o token B"
            })
        }

        try {
            const decoded = await promisify(jwt.verify)(authHeader, JWT_SECRET)
            req.userId = decoded.id

            jwt.sign({
                data: decoded,
                expiresIn: '-1s'
            }, JWT_SECRET, (err, authHeader) => {
                if (err) throw err;
                res.status(200).json({
                    erro: false,
                    mensagem: "Usuário deslogado com sucesso!"
                });   
            })
        } catch (err) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: necessário realizar o login para acessar a página! Token inválido"
            });
        }
    }
}