const router = require('express').Router();
const { db } = require('../db/index');
const { post } = require('./padres');

router.get('/', (req, res) => {
    db.serialize(()=> {
        db.all(`SELECT * FROM \"Hijos\"`, (err, rows) => {
        if (err) {
          console.error(err.message);
        }
        res.send(rows)
      });
    })
})

router.get('/sinpadre', (req, res) => {
    db.serialize(()=> {
        db.all(`SELECT * FROM \"Hijos\" WHERE hijode IS NULL`, (err, rows) => {
        if (err) {
          console.error(err.message);
        }
        res.send(rows)
      });
    })
})

router.post('/', (req, res) => {

    const {
        nombre,
        hijode
    } = req.body;

    const query = `INSERT INTO "Hijos" (nombre, hijode) VALUES(?, ?);`;
    const params = [nombre, hijode]

    db.serialize(()=> {
        db.run(query, params, (err,rows) => {
        if (err) {
          console.log(err);
          return res.send("Error Creando el recuro")
        }

        res.send("Recurso creado correctamente")
      });
    })
})

router.get('/:id', (req,res) => {

  const id = req.params.id

  const query = `SELECT * FROM Hijos WHERE id = ?`;
  const params = [id]

  db.get(query,params, (err, row) => {
    if (err) {
      return res.send(`Error del lado del servidor`).status(500)
    } 

    if (row == null) {
      return res.send(`Error, el hijo con el id ${id} no existe`).status(404)
    }

    res.send(row).status(200)
   })
})

router.put('/:id', (req, res) => {

    const id = req.params.id

    const {
        nombre,
        hijode
    } = req.body;

    const query = `UPDATE "Hijos" set nombre=?, hijode=? WHERE id=?;`;
    const params = [nombre, hijode, id]

    db.serialize(()=> {
        db.run(query, params, (err,rows) => {
        if (err) {
            console.log(err);
          return res.send("Error actualizando el recurso")
        }

        res.send("Recurso actualizado correctamente")
      });
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM "Hijos" WHERE id=?;`;
    const params = [id];

    db.serialize(()=> {
        db.run(query, params, (err,rows) => {
        if (err) {
            console.log(err);
           return res.send("Error Eliminando el recurso")
        }

        res.send("Recurso eliminado correctamente")
      });
    })
})

module.exports = router