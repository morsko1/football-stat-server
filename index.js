const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/');
const cron = require('node-cron');
const updateDB = require('./util/updateDB.js');

const server = http.createServer(app);
app.use(bodyParser.json());
app.use(routes);

// node-cron syntax
 // # ┌────────────── second (optional)
 // # │ ┌──────────── minute
 // # │ │ ┌────────── hour
 // # │ │ │ ┌──────── day of month
 // # │ │ │ │ ┌────── month
 // # │ │ │ │ │ ┌──── day of week
 // # │ │ │ │ │ │
 // # │ │ │ │ │ │
 // # * * * * * *

/*cron.schedule('45 15 * * *', () => {
  console.log('running a cron task');
  updateDB();
});*/

const port = 5555;

app.listen(port, () => {
    console.log(`listen on ${port}`);
});
