const knex = require('../database/connection');

const registerClientBilling = async (req, res) => {
  let { client_id, description, status, value, due_date, } = req.body;

  if (!description || !status || !value || !due_date) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  const dataAtual = new Date()

  if (status === 'Pendente') {
    if ((+(new Date(due_date)) + 86399000) < +dataAtual) {
      status = 'Vencida'
    }
  }

  try {
    const registeredBilling = await knex('billings')
      .insert({
        client_id,
        description,
        status,
        value,
        due_date
      }).returning('*');

    if (!registeredBilling) {
      return res.status(400).json({ "mensagem": "A cobrança não foi cadastrada." });
    }

    return res.status(200).json({ "mensagem": "Cobrança cadastrada com sucesso" });

  } catch (error) {
    return res.status(500).json({ "mensagem": error.message });
  }
}


const listAllBillingsClients = async (req, res) => {
  const now = new Date()
  try {

    const foundBillings = await knex.select(
      'b.id',
      'c.name as client_name',
      'c.id as client_id',
      'b.description',
      'b.status',
      'b.value',
      'b.due_date')
      .from('billings as b')
      .leftJoin('clients as c', 'c.id', 'b.client_id')
      .orderBy('id', 'asc')

    if (!foundBillings) {
      return res.status(400).json({ "mensagem": "Nenhuma cobrança encontrada!!!." });
    }
    foundBillings.map(async (item) => {
      if (+item.due_date < +now && item.status === 'Pendente') {
        await knex('billings').update({
          status: 'Vencida'
        }).where('id', item.id)
      }
    })

    return res.status(200).json(foundBillings);
  } catch (error) {
    return res.status(500).json({ "mensagem": error.message });
  }
}



const listClientBillings = async (req, res) => {
  const { clientId } = req.params;

  try {

    const foundBillings = await knex('billings').where('client_id', clientId);

    if (!foundBillings) {
      return res.status(400).json({ "mensagem": "A cobrança não foi encotrada." });
    }

    return res.status(200).json(foundBillings);

  } catch (error) {
    return res.status(500).json({ "mensagem": error.message });
  }
}

const deleteBilling = async (req, res) => {
  const { id } = req.params

  try {
    const billingFound = await knex('billings').where('id', id)

    if (billingFound.length === 0) {
      return res.status(404).json({ "mensagem": "Cobrança não encontrada." })
    }
    if (billingFound[0].status === 'Vencida' || billingFound[0].status === 'Paga') {
      return res.status(400).json({ "mensagem": "Esta cobrança não pode ser excluida" })
    }

    const billingDeleted = await knex('billings').del().where('id', id)

    if (!billingDeleted) {
      return res.status(400).json({ "mensagem": "Não foi possível excluir a cobrança." })

    }

    return res.status(200).json({ "mensagem": "Cobrança excluida com sucesso" })

  } catch (error) {
    return res.status(500).json({ "mensagem": error.message });
  }
}

const detaliBilling = async (req, res) => {
  const { id } = req.params;

  try {
    const billing = await knex.select(
      'b.id',
      'c.name as client_name',
      'c.id as client_id',
      'b.description',
      'b.status',
      'b.value',
      'b.due_date'
    )
      .from('billings as b')
      .leftJoin('clients as c', 'c.id', 'b.client_id').where('b.id', +id).first();

    if (!billing) {
      return res.status(404).json({ "mensagem": "Cobrança não encontrada" });
    }

    return res.status(200).json(billing);
  } catch (error) {
    return res.status(500).json({ "mensagem": error.message });
  }
}


const editDataBilling = async (req, res) => {
  const { id } = req.params;
  const { description, status, value, due_date, } = req.body;

  if (!description || !status || !value || !due_date) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  const now = new Date()


  try {

    const billingUpdated = await knex('billings').update({
      description,
      status,
      value,
      due_date
    }).where('id', +id);

    if (billingUpdated.length === 0) {
      return res.status(500).json({ "mensagem ": "Não foi possível editar a cobrança" });
    }

    const foundBillings = await knex.select(
      'b.id',
      'c.name as client_name',
      'c.id as client_id',
      'b.description',
      'b.status',
      'b.value',
      'b.due_date')
      .from('billings as b')
      .leftJoin('clients as c', 'c.id', 'b.client_id')
      .orderBy('id', 'asc')

    if (!foundBillings) {
      return res.status(400).json({ "mensagem": "Nenhuma cobrança encontrada!!!." });
    }
    foundBillings.map(async (item) => {
      if (+item.due_date < +now && item.status === 'Pendente') {
        await knex('billings').update({
          status: 'Vencida'
        }).where('id', item.id)
      }
    })

    return res.status(200).json({ "mensagem ": "Dados da cobrança editados com sucesso" });


  } catch (error) {
    return res.status(500).json({ "mensagem": error.message });
  }

}

module.exports = {
  registerClientBilling,
  listAllBillingsClients,
  listClientBillings,
  deleteBilling,
  editDataBilling,
  detaliBilling
}





