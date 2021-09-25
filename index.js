const express = require('express');
const chalk = require('chalk');
const {
    PORT_SERVER
} = require('./config')

const app = express();

app.get('/', (req, res) => {
    res.send('hola mundo');
})

app.listen(PORT_SERVER, () => {
    console.log("El servidor está escuchando en el puerto " + chalk.green(PORT_SERVER));
})