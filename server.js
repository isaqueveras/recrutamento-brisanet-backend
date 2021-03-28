const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./src/models");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Sicronizar com o banco de dados
db.sequelize.sync({ force: false }); 

// Incluindo as rotas
require("./src/routes/Clientes.routes")(app);
require("./src/routes/Enderecos.routes")(app);
require("./src/routes/Ponto.routes")(app);
require("./src/routes/Contratos.routes")(app);

// Adicionando uma porta para o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
