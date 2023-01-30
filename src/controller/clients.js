const knex = require('../database/connection');
const { formantName } = require('../validations/validateDatas');
const { schemaClientRegister } = require("../validations/schemaClientRegistration");

const registerClient = async (req, res) => {
    const { name, email, cpf, telephone, cep, street, complement, district, city, state } = req.body;

    if (cep && cep.length !== 8) {
        return res.status(400).json({ message: "Insira um cep válido com 8 dígitos" });
    }


    try {
        await schemaClientRegister.validate(req.body);

        if (cpf.length !== 11) {
            return res.status(400).json({ "mensagem": "Escreva um CPF válido com 11 Dígitos" })
        }

        if (telephone.length !== 11) {
            return res.status(400).json({ "mensagem": "Escreva um número de telefone válido com DDD EX: 99985678967" })
        }


        const clientEmailFound = await knex('clients')
            .where('email', email)
            .first();

        if (clientEmailFound) {
            return res.status(400).json({ "mensagem": "Email já cadastrado" });
        }

        const checkCpfAlreadyExists = await knex('clients')
            .where('cpf', cpf)
            .first();


        if (checkCpfAlreadyExists) {
            return res.status(400).json({ "mensagem": "CPF já cadastrado" });
        }

        const checkTelephoneAlreadyExists = await knex('clients')
            .where('telephone', telephone)
            .first();


        if (checkTelephoneAlreadyExists) {
            return res.status(400).json({ "mensagem": "Número de telefone já cadastrado" });
        }


        const clientRegistered = await knex('clients')
            .insert({
                name: formantName(name),
                email,
                cpf,
                telephone,
                cep,
                street,
                complement,
                district,
                city,
                state
            });

        if (clientRegistered.length === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível cadastrar o cliente" });
        }

        return res.status(200).json({ "mensagem": "Cliente cadastrado com sucesso" });
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

const clientsList = async (req, res) => {
    try {
        const clients = await knex.raw(`select *, (
            select count(*) 
            from billings 
            where status = 'Vencida' 
            and billings.client_id = clients.id
            limit 1
              ) as overcount
          from clients `);

        return res.status(200).json(clients.rows);


    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

const clientData = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await knex('clients')
            .where('id', +id)
            .first();

        if (!client) {
            return res.status(404).json({ "mensagem": "Cliente não encontrado" });
        }

        return res.status(200).json(client);
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

const editClient = async (req, res) => {
    const { id } = req.params;
    const { name, email, cpf, telephone, cep, street, complement, district, city, state } = req.body;

    try {
        await schemaClientRegister.validate(req.body);

        if (cpf.length !== 11) {
            return res.status(400).json({ "mensagem": "Escreva um CPF válido com 11 Dígitos" })
        }

        if (telephone.length !== 11) {
            return res.status(400).json({ "mensagem": "Escreva um número de telefone válido com DDD EX: 99985678967" })
        }

        const clientEmailFound = await knex('clients')
            .where('email', email)
            .first();

        if (clientEmailFound) {
            return res.status(400).json({ "mensagem": "Email já cadastrado" });
        }

        const checkCpfAlreadyExists = await knex('clients')
            .where('cpf', cpf)
            .first();


        if (checkCpfAlreadyExists) {
            return res.status(400).json({ "mensagem": "CPF já cadastrado" });
        }

        const checkTelephoneAlreadyExists = await knex('clients')
            .where('telephone', telephone)
            .first();


        if (checkTelephoneAlreadyExists) {
            return res.status(400).json({ "mensagem": "Número de telefone já cadastrado" });
        }


        const clientUpdate = await knex('clients').update({
            name: formantName(name),
            email,
            cpf,
            telephone,
            cep,
            street,
            complement,
            district,
            city,
            state
        }).where('id', +id);

        if (clientUpdate.length === 0) {
            return res.status(500).json({ "mensagem ": "Não foi possível editar o cliente" });
        }

        return res.status(200).json({ "mensagem ": "Dados do cliente editados com sucesso" });


    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

const deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await knex('clients')
            .where('id', +id)
            .first();

        if (!client) {
            return res.status(404).json({ "mensagem": "Cliente não encontrado" });
        }

        const clientDeleted = await knex('clients')
            .delete()
            .where('id', +id);

        if (clientDeleted.length === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível deletar o cliente" });
        }

        return res.status(200).json({ "mensagem": "Cliente excluido" });

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

module.exports = {
    registerClient,
    clientsList,
    clientData,
    editClient,
    deleteClient
}