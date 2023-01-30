require("dotenv").config();
const express = require('express');
const routes = require('./routes/routes');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(process.env.PORT || 3334);
