const express = require('express');
const chalk = require('chalk');
const {
    PORT_SERVER
} = require('./config')
const { db } = require('./db/index')
const padres = require('./routes/padres');
const hijos = require('./routes/hijos');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hola mundo');
})

app.use('/api/padres', padres);
app.use('/api/hijos', hijos);

app.listen(PORT_SERVER, () => {
    console.log("El servidor está escuchando en el puerto " + chalk.green(PORT_SERVER));
})