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

// GET /api/notes should return the notes.html file.
app.get('/api/notes', (req, res) => {
  // Read the contents of the 'db.json' file to retrieve notes data
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      throw err;
    }
    // Parse the JSON data and send it as a JSON response
    var info = JSON.parse(data);
    res.json(info);
  });
});

app.post('/api/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // Check if both title and text are present in the request
  if (title && text) {
    // Create a new note object with a unique ID generated using uuidv4
    const newNote = {
      title,
      text,
    };
    newNote.id = uuidv4();

    // Read existing notes from the 'db.json' file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert the string into a JSON object
        const parsedNotes = JSON.parse(data);

        // Add the new note to the existing notes
        parsedNotes.push(newNote);

        // Write the updated notes back to the 'db.json' file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
          } else {
            console.info('Successfully updated notes!');

            // Send a response to the client indicating success
            const response = {
              status: 'success',
              body: newNote,
            };
            res.json(response);
          }
        });
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

  // Read the contents of the 'db.json' file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Parse the JSON data into an array of notes
      const parsedNotes = JSON.parse(data);

      // Filter out the note with the specified ID and create an updated notes array
      const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);

      // Write the updated notes back to the 'db.json' file
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

// GET * should return the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);