const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.Port || 3001;

const app = express();

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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

    // Read existing notes from file
    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/notes.json',
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

// Route to handle the /notes path and render the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
