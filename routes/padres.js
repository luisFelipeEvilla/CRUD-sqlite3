const router = require('express').Router();
const { db } = require('../db/index');

router.get('/', (req, res) => {
    db.serialize(() => {
        db.all(`SELECT * FROM \"Padres\"`, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.send("Error del lado del servidor").status(500)
            }
            res.send(rows).status(200)
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
                res.send("Error, del lado del servidor").status(500)
            }
            res.send(rows).status(200)
        });
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM "Padres" WHERE id = ?`
    const params = [id]

    db.serialize(() => {
        db.get(query, params, (err, row) => {
            if (err) {
                console.log(err);
                return res.send(`Error del lado del servidor`).status(500)
            }

            const padre = row

            if (padre == null) {
                return res.send(`Error, el padre con el id ${id} no existe`).status(404)
            }

            const query = `SELECT * FROM "Hijos" WHERE hijode = ?`
            const params = [padre.id]

            db.all(query, params, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return res.send("Error del lado del servidor").status(500)
                }

                padre.hijos = rows;
                res.send(padre).status(200)
            })
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
                res.send("Error del lado del servidor").status(500)
            }
            res.send(rows).status(200)
        });
    })
})

router.post('/', (req, res) => {

    const {
        nombre,
    } = req.body;

    const query = `INSERT INTO "Padres" (nombre) VALUES(?);`;
    const params = [nombre]

    db.serialize(() => {
        db.run(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                return res.send("Error Creando el recuro").status(500)
            }

            res.send("Recurso creado correctamente").status(200)
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

    db.serialize(() => {
        db.run(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                return res.send("Error actualizando el recurso").send(500)
            }

            res.send("Recurso actualizado correctamente").status(200)
        });
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id

    const query = `UPDATE "Hijos" SET hijode = ? WHERE hijode=?;`;
    const params = [null, id];
    
    db.serialize(() => {
        db.run(query, params, (err, rows) => {
            if (err) {
                console.log(err);
                return res.send("Error Eliminando el padre de los hijos").status(500)
            }

            const query = `DELETE FROM "Padres" WHERE id=?;`;
            const params = [id];

            db.run(query, params, (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.send("Error Eliminando el padre").status(500)
                }  

                res.send("Recurso eliminado correctamente").status(200)
            })
        });
    })
})



module.exports = router