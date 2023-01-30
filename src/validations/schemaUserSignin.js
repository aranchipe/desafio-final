const yup = require('./settings');


const schemaLoginUser = yup.object().shape({
    email: yup.string().email().required('O campo email é obrigatório'),
    password: yup.string().required('O campo password é obrigatório').min(6),
})

module.exports = {
    schemaLoginUser
};