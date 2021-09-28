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
          return res.send("Error de parte del servidor").status(500)
        }

        res.send(rows).status(200)
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
          return res.send("Error Creando el recuro").status(500)
        }

        res.send("Recurso creado correctamente").status(200)
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

    const hijo = row

    const query = `SELECT * FROM Padres WHERE id = ?`;
    const params = [hijo.hijode]

    db.get(query, params, (err, row) => {
      if (err) {
        return res.send(`Error del lado del servidor`).status(500)
      } 

      hijo.padre = row;

      res.send(hijo).status(200)
    })
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
          return res.send("Error actualizando el recurso").status(500)
        }

        res.send("Recurso actualizado correctamente").status(200)
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
           return res.send("Error Eliminando el recurso").status(500)
        }

        res.send("Recurso eliminado correctamente").status(200)
      });
    })
})

module.exports = router