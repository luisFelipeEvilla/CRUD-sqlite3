require('dotenv').config();

const PORT_SERVER = process.env.PORT_SERVER || 3000
const DB_FILE = process.env.DB_FILE || "./bienestar.db"

module.exports = {
    PORT_SERVER,
    DB_FILE
}