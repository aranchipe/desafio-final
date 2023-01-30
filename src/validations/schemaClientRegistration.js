const yup = require('./settings');

const schemaClientRegister = yup.object().shape({
    name: yup.string().required('O campo name é obrigatório'),
    email: yup.string().email().required('O campo email é obrigatório'),
    cpf: yup.string().required('O campo cpf é obrigatório'),
    telephone : yup.string().required('O campo telefone é obrigatório')
})

module.exports = {
 schemaClientRegister
}