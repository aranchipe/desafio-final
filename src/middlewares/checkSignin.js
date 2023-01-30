const knex = require('../database/connection')
const jwt = require('jsonwebtoken');

const checkSignin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ "mensagem": 'O usuário deve estar logado e possuir um token válido. Favor realizar login.' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = await jwt.verify(token, process.env.JWT_SECRET);

        const userFound = await knex('users').where('id', id);

        if (userFound.length === 0) {
            return res.status(404).json({ "mensagem": 'O usuário logado não foi encontrado no banco de dados.' });
        }

        const user = await knex('users').select('id', 'name', 'email', 'cpf', 'telephone').where('id', id);

        req.user = user[0];

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: 'Para acessar este recurso o usuário deve estar logado e possuir um token válido. Favor realizar login.' });
        }
        return res.status(500).json({ "mensagem": error.message });
    }
}

module.exports = { checkSignin };
