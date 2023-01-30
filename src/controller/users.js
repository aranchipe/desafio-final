const securePassword = require('secure-password');
const knex = require('../database/connection');
const pwd = securePassword();
const { schemaRegisterUser } = require('../validations/schemaUserRegistration');
const { schemaLoginUser } = require('../validations/schemaUserSignin');
const { formantName } = require('../validations/validateDatas')
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { name, email, password} = req.body;

    try {
        await schemaRegisterUser.validate(req.body);

        const userFound = await knex('users')
            .where('email', email);

        if (userFound.length > 0) {
            return res.status(400).json({ "mensagem": "email já cadastrado" });
        }

        const hash = (await pwd.hash(Buffer.from(password))).toString('hex');
        const userRegistered = await knex('users').insert({
            name: formantName(name),
            email,
            password: hash,
        })

        if (userRegistered.length === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível criar conta" });
        }

        return res.status(201).json({ "mensagem": "Conta criada com sucesso" });

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        await schemaLoginUser.validate(req.body);

        const userFound = await knex('users')
            .where('email', email);

        if (userFound.length === 0) {
            return res.status(400).json({ "mensagem": "Email ou senha incorretos" });
        }

        const user = userFound[0]
        const result = await pwd.verify(Buffer.from(password), Buffer.from(user.password, 'hex'))

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ "mensagem": "Email ou senha incorretos" });
            case securePassword.VALID:
                break
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(password))).toString('hex')
                    await knex('users').update({ password: hash }).where('email', email)
                } catch {
                }
                break
        }

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        })

        return res.status(200).json({
            "usuario":
            {
                "id": user.id,
                "nome": formantName(user.name),
                "email": user.email
            },
            "token": token
        });

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }

}

const userData = async (req, res) => {
    const { user } = req;

    try {
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

const editUser = async (req, res) => {
    const { name, email, cpf, telephone, password } = req.body;
    const { user } = req;

       

    try { if(!name || !email){
         return res.status(400).json({ "mensagem": "Os campos Nome e Email são obrigatórios" });
        }

        // await schemaValidateDatas.validate(req.body);
        
        // const checkCpfAlreadyExists = await knex('users')
        //     .where('cpf', cpf)
        //     // .andWhere('id', '!=', user.id);
            
        
        //  if(checkCpfAlreadyExists){
        //     return res.status(400).json({ "mensagem": "CPF já cadastrado" });
        // }   
        
        // const userFound = await knex('users')
        //     .where('email', email)
        //     .andWhere('id', '!=', user.id);
        
        // if (userFound) {
        //     return res.status(400).json({ "mansagem": "email já cadastrado" });
        // }

        const hash = (await pwd.hash(Buffer.from(password))).toString('hex');
        const userEdited = await knex('users')
            .update({
                name: formantName(name),
                email,
                cpf,
                telephone,
                password: hash
            })
            .where('id', user.id)

        if (userEdited.length === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível atualizar o usuario" });
        }

        return res.status(200).json({ "mensagem": "Usuário editado com sucesso" });

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}


const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await knex('users').where({ id: id }).first();

        if (!user) {
            return res.status(404).json({ "mensagem": "Usuário não encontrado" });
        }

        const userDeleted = await knex('users').where({ id: id }).del();

        if (!userDeleted) {
            return res.status(400).json({ "mensagem": "Falha ao tentar excluir conta" });

        }

        return res.status(200).json('Usuário excluido com sucesso!!!');
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

module.exports = {
    signup,
    signin,
    userData,
    editUser,
    deleteUser
}
