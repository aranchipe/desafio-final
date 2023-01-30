const axios = require('axios');

async function checkZipCode(req, res) {
    const { cep } = req.params;

    if(cep.length !== 8){
        return res.status(400).json({message: "Insira um cep válido com 8 dígitos"});
    }

    try {
        
        const findCEP = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

        return res.status(200).json(findCEP.data);

    } catch (error) {
        return res.status(500).json(error);
    }

}



module.exports = { checkZipCode };