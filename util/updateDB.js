const http = require('http');
const parser = require('./parser.js');

const baseUrl = 'http://www.football-data.co.uk/mmz4281/';

const currentSeason = '1920';

const leagues = [
  'E0',
  'D1',
  'I1',
  'SP1',
  'F1'
];

const files = [];
leagues.map(league => {
  let res = {};
  let link = `${baseUrl}${currentSeason}/${league}.csv`;
  res.link = link;
  res.meta = {season: currentSeason, league: league};
  files.push(res);
});

function getData (url) {
  return new Promise((resolve, reject) => {
    let csvData = '';
    http.get(url, async (response) => {
      response.on('data', (chunk) => {
        csvData += chunk;
      });
      response.on('end', () => {
        console.log('loaded data: ', url);
        resolve(csvData);
      });
      response.on('error', (e) => {
        reject(e);
      });
    });
  });
}

async function updateDB() {
  console.log('updateDB function is called');
  for (const file of files) {
    const data = await getData(file.link);
    await parser.parseDataAndWrite([data], file.meta);
  }
  console.log('DB updated!');
}

module.exports = updateDB;
