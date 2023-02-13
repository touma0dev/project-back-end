const fs = require('fs');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'salt.db.elephantsql.com',
    user : 'ixjsljvy',
    password : `ZrcNvMZjr1brxEh_5t070GL2ba35VNyf`,
    database : 'ixjsljvy'
  }
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
  }, 5000);
}

monitorTable();
