const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'raja.db.elephantsql.com',
    user : 'flrwydvq',
    password : `GR-lX238UqFEWMRCNCVPZQ4WmZs3dBOY`,
    database : 'flrwydvq'
  }
});

app.use(express.static('dist'));

async function updateFile() {
  const rows = await knex.select().from('processor');
  fs.writeFile(path.join(__dirname, 'dist', 'data.json'), JSON.stringify(rows), (err) => {
    if (err) throw err;
    console.log('File updated successfully');
  });
}

async function monitorTable() {
  let previousRows = await knex.select().from('processor');

  setInterval(async () => {
    const currentRows = await knex.select().from('processor');
    if (previousRows.length !== currentRows.length || JSON.stringify(previousRows) !== JSON.stringify(currentRows)) {
      updateFile();
      previousRows = currentRows;
    }
  }, 2000);
}

monitorTable();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
