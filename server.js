// Dependencies

const fs = require('fs');
const express = require('express');
const path = require('path');

//npm package to generate a randomized id: https://www.npmjs.com/package/generate-unique-id
const generateUniqueId = require('generate-unique-id');

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

//handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = './db/db.json';

//global array to store notes
let notes = [];

//Routes

//routes user to home page and notes page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

//gets existing notes
app.get('/api/notes', (req, res) => fs.readFile(db, 'utf-8', function(err, data) {
    if(err) throw err;
    // let parsedData = JSON.parse(data);
    // res.json(parsedData);
    // console.log(parsedData);
}));
//saves new note
app.post('/api/notes', (req, res) => {
    //gives each note the user creates a unique 8 number ID
    const newId = generateUniqueId({
        length: 8,
        useLetters: false
    });

    const newNote = req.body;

    newNote.id = newId;

    //reads user note, converts to json, pushes to notes array and writes to db.json
    fs.readFile(db, 'utf-8', function(err, data) {
        if(err) throw err;
        notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(db, JSON.stringify(notes), 'utf-8', function(err) {
            if (err) throw err
        })
    });

    res.redirect('/');
})

//delete a note
app.delete('/api/notes/:id', (req, res) => {

    fs.readFile(db, 'utf-8', function(err, data) {
        if(err) throw err
        notes = JSON.parse(data);

        const currentObject = notes.find(({id})=>id===req.params.id)

        notes.splice(currentObject, 1);

        // let index = notes.indexOf(currentId);
        // console.log(index);
        // notes.splice(index, 1)

        fs.writeFile(db, JSON.stringify(notes), 'utf-8', function(err) {
            if (err) throw err
            console.log(`Deleted note #${req.params.id}`)
        });
    });
    res.redirect('/');
});

// Starts the server to begin listening
app.listen(PORT, () => 
console.log(`App listening at http://localhost:${PORT}`));