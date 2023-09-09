const express = require('express');

const PORT = process.env.Port || 3001;

const app = express();

// Middleware for parsing application/jsaon and urlencoded data
app.use(express.json());
app.use(express.urleconded({ extended: true}));

app.use(express.static('public'));

// The landing page of the Note taker already has a working eventListener and everything it's set up to add the back-end files to make it work

// The notes.html file is lacking some styling but it's there for the most part

// When click on the eventListener it shoul take you to the note.html (I don't think it's another html file but I'm not sure)

// Old notes should be store (is it locally or on the server? It probaby would be on the cloud/server) will appear on the left colunm, while if you would like to take new note, there are empy fields with another eventListener to save the data. Also, the old notes are link that will take you to the notes (not another html, it just appears on the right colunm). On the right colunm there is the "note title" and the "note text". On the left colunm you only see the "note title"

// What are the elemento in the body object??? Note title and note text?

// Old notes can be mdified once you have clicked on them and they are on the right colunm

// I need more pseudo-code here explaining how each action on each file is onnected to each other, but given my limited time right now, this will be my best effort

// Once presented with the home page, the event listener will send a GET to the notes.html

// The old note in the notes.html will be links that will send a GET to the param for notes.html

// The save eventListener is a POST method tht will send the information to the index.html? (not sure whether this will be send to the inde or the note, it makes more sense if it's in the notes.html)


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
