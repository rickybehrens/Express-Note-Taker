const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.Port || 3001;

const app = express();

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET /notes should return the notes.html file.
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      throw err;
    }
    // console.log(data)
    var info = JSON.parse(data);
    // console.log(info)
    res.json(info)
  })
});

app.post('/api/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // Check if both title and text are present in the request
  if (title && text) {
    // Create a new note object
    const newNote = {
      title,
      text,
    };  
    newNote.id = uuidv4()
    console.log(newNote)
    // Read existing notes from file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
            } else {
              console.info('Successfully updated notes!');

              // Send a response to the client (inside the callback)
              const response = {
                status: 'success',
                body: newNote,
              };  
              res.json(response);
            }  
          }  
        );  
      }  
    });  
  } else {
    // If title or text is missing, send an error response
    res.status(400).json({ error: 'Both title and text are required.' });
  }  
});  

// DELETE /api/notes/:id to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);

      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          console.info(`Note with ID ${noteId} deleted successfully.`);
          res.sendStatus(200); // Send a success response
        }
      });
    }
  });
});

// Route to handle the /notes path and render the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//GET * should return the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
