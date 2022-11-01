const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3000;

app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "oh no!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. 
app.post('/api/notes/', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "oh no!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            req.body.id = uuid();
            dataArr.push(req.body);
            fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: "oh no!",
                        err: err
                    })
                }
                else {
                    res.json(dataArr)
                }
            })
        }
    })
})

// DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. 
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "oh no!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            const result = dataArr.filter((element) => element.id !== noteId);

            fs.writeFile('./db/db.json', JSON.stringify(result, null ,4), (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: "oh no!",
                        err: err
                    })
                }
                else {
                    res.json(`Note ${noteId} has been deleted 🗑️`);
                }
            });
        }
    })
});

// GET * should return the index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.listen(PORT, () => {
    console.log(`listenin on port ${PORT}`)
})