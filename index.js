const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'raja.db.elephantsql.com',
    user : 'flrwydvq',
    password : `GR-lX238UqFEWMRCNCVPZQ4WmZs3dBOY`,
    database : 'flrwydvq'
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

async function updateFile() {
  const rows = await knex.select().from('processor');
  fs.writeFile('./data.json', JSON.stringify(rows), (err) => {
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
  }, 4000);
}

monitorTable();
