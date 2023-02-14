const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'raja.db.elephantsql.com',
    user : 'flrwydvq',
    password : 'GR-lX238UqFEWMRCNCVPZQ4WmZs3dBOY',
    database : 'flrwydvq'
  }
});

// Serve the files in the `dist` folder as static files
app.use(express.static(path.join(__dirname, 'dist')));

// Route to serve the JSON data file
app.get('/data', async (req, res) => {
  try {
    const rows = await knex.select().from('processor');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
});

// Periodically update the JSON data file
async function updateFile() {
  try {
    const rows = await knex.select().from('processor');
    fs.writeFile('./dist/data.json', JSON.stringify(rows), (err) => {
      if (err) throw err;
      console.log('File updated successfully');
    });
  } catch (err) {
    console.error(err);
  }
}

async function monitorTable() {
  let previousRows = await knex.select().from('processor');

  setInterval(async () => {
    const currentRows = await knex.select().from('processor');
    if (previousRows.length !== currentRows.length || JSON.stringify(previousRows) !== JSON.stringify(currentRows)) {
      updateFile();
      previousRows = currentRows;
    }
  }, 4000);
}

monitorTable();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
