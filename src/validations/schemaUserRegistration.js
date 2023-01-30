const yup = require('./settings');

const schemaRegisterUser = yup.object().shape({
    name: yup.string().required('O campo name é obrigatório'),
    email: yup.string().email().required('O campo email é obrigatório'),
    password: yup.string().required('O campo password é obrigatório').min(6)
})



module.exports = {
    schemaRegisterUser,
};