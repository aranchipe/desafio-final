const express = require('express');
const { checkZipCode } = require('../services/viaCEP')
const { registerClient, clientsList, clientData, editClient, deleteClient } = require('../controller/clients');
const { signup, signin, userData, editUser, deleteUser } = require('../controller/users');
const { checkSignin } = require('../middlewares/checkSignin');
const { registerClientBilling, listAllBillingsClients, listClientBillings, editDataBilling, deleteBilling, detaliBilling } = require("../controller/billing");

const route = express();

// Registration and login routes
route.post('/signup', signup);
route.post('/signin', signin);


// Api integration route viaCep
route.get('/viaCep/:cep', checkZipCode);


route.use(checkSignin);


// User routes
route.put('/user', editUser);
route.get('/user', userData);
route.delete('/user/:id', deleteUser);


// Customer routes
route.post('/clients', registerClient);
route.get('/clients', clientsList);
route.get('/clients/:id', clientData);
route.put('/clients/:id', editClient);
route.delete('/clients/:id', deleteClient);



// Billings routes
route.post('/billing', registerClientBilling); 
route.get('/billings', listAllBillingsClients);   
route.put('/billing/:id', editDataBilling);
route.get('/billings/:clientId', listClientBillings);
route.delete('/billings/:id', deleteBilling);
route.get('/billing/:id', detaliBilling);


module.exports = route;
