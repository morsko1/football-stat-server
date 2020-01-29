const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/');
const cron = require('node-cron');
const updateDB = require('./util/updateDB.js');
const config = require('./config.js');

const server = http.createServer(app);
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.trustedClient); // update to match the domain you will make the request from
    // res.header("Access-Control-Allow-Origin", "*"); // all domains are acceptable
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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

/*cron.schedule('0 05 * * *', () => {
  console.log('running a cron task');
  updateDB();
});*/

const port = 5555;

app.listen(port, () => {
    console.log(`listen on ${port}`);
});
