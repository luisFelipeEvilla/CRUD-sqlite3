const router = require('express').Router();
const { db } = require('../db/index');

router.get('/', (req, res) => {
    db.serialize(() => {
        db.all(`SELECT * FROM \"Padres\"`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            res.send(rows)
        });
    })
})

router.get('/:id/hijos', (req, res) => {
    const id = req.params.id

    db.serialize(() => {
        db.all(`SELECT * FROM \"Hijos\" WHERE hijode=${id}`, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            res.send(rows)
        });
    })
})

router.get('/sinhijos', (req, res) => {
    const query = `SELECT  *
    FROM "Padres" p WHERE
    (
        SELECT  COUNT(*)
        FROM "Hijos" h
        WHERE h.hijode = p.id
    ) = 0`;

    db.serialize(() => {
        db.all(query, (err, rows) => {
            if (err) {
                console.error(err.message);
            }
            res.send(rows)
        });
    })
})

router.get('/contarHijos', (req, res) => {
    const query = `SELECT  id
        ,nombre
        ,(
    SELECT  COUNT(*) AS numHijos
    FROM "Hijos" h
    WHERE h.hijode = p.id) AS numHijos
    FROM "Padres" p;`;

    db.serialize(() => {
        db.all(query, (err, rows) => {
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
    } = req.body;

    const query = `INSERT INTO "Padres" (nombre) VALUES(?);`;
    const params = [nombre]

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

router.put('/:id', (req, res) => {

    const id = req.params.id

    const {
        nombre
    } = req.body;

    const query = `UPDATE "Padres" set nombre=? WHERE id=?;`;
    const params = [nombre, id]

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

    const query = `DELETE FROM "Padres" WHERE id=?;`;
    const params = [id];

    db.serialize(()=> {
        db.run(query, params, (err,rows) => {
        if (err) {
            return res.send("Error Eliminando el recurso")
        }

        res.send("Recurso eliminado correctamente")
      });
    })
})



module.exports = router