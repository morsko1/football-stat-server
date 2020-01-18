const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const connectionUrl = 'mongodb://localhost:27017/';
const dbName = 'football-data';
const collectionName = 'stat';
const fileNameToLeagueName = require('./fileNameToLeagueName');
const fileNameToCountryName = require('./fileNameToCountryName');

function getSecondHalfResult (homeTeamGoals, awayTeamGoals) {
  switch (true) {
    case (homeTeamGoals - awayTeamGoals) > 0:
      return 'H';
      break;
    case (homeTeamGoals - awayTeamGoals) < 0:
      return 'A';
      break;
    default:
      return 'D'
      break;
  }
}

const parseDataAndWrite = function (results, metaData) {
  return new Promise((resolve, reject) => {
    const championships = [];
    results.forEach((result, i) => {
      const standings = [];// this is result array of standings objects
      const teamsList = [];// this is result array of teams objects
      const games = [];
      const gamesFull = [];
      const arr = result.split('\n');
      const resultArr = [];
      const headers = arr[0].split(',');

      arr.forEach((item, i, arr) => {
        if (i === 0 || i === arr.length - 1) {
          return;
        }
        item = item.split(',');
        const obj = {};
        obj['HomeTeam'] = item[headers.indexOf('HomeTeam')];// HomeTeam = Home Team
        obj['AwayTeam'] = item[headers.indexOf('AwayTeam')];// AwayTeam = Away Team
        obj['FTHG'] = item[headers.indexOf('FTHG')];// FTHG = Full Time Home Team Goals
        obj['FTAG'] = item[headers.indexOf('FTAG')];// FTAG = Full Time Away Team Goals
        obj['FTR'] = item[headers.indexOf('FTR')];// FTR = Full Time Result (H=Home Win, D=Draw, A=Away Win)
        resultArr.push(obj);

        const objGame = {};
        objGame.id = i - 1;
        objGame.date = item[headers.indexOf('Date')];// Date = Match Date (dd/mm/yy)
        objGame.homeTeam = item[headers.indexOf('HomeTeam')];// HomeTeam = Home Team
        objGame.awayTeam = item[headers.indexOf('AwayTeam')];// AwayTeam = Away Team
        objGame.fullTimeHomeTeamGoals = parseInt(item[headers.indexOf('FTHG')], 10);// FTHG = Full Time Home Team Goals
        objGame.fullTimeAwayTeamGoals = parseInt(item[headers.indexOf('FTAG')], 10);// FTAG = Full Time Away Team Goals
        objGame.fullTimeResult = item[headers.indexOf('FTR')];// FTR = Full Time Result (H=Home Win, D=Draw, A=Away Win)
        objGame.halfTimeHomeTeamGoals = parseInt(item[headers.indexOf('HTHG')], 10);
        objGame.halfTimeAwayTeamGoals = parseInt(item[headers.indexOf('HTAG')], 10);
        objGame.halfTimeResult = item[headers.indexOf('HTR')];
        // get second half res
        objGame.secondHalfHomeTeamGoals = parseInt(item[headers.indexOf('FTHG')], 10) - parseInt(item[headers.indexOf('HTHG')], 10);
        objGame.secondHalfAwayTeamGoals = parseInt(item[headers.indexOf('FTAG')], 10) - parseInt(item[headers.indexOf('HTAG')], 10);
        objGame.secondHalfResult = getSecondHalfResult(objGame.secondHalfHomeTeamGoals, objGame.secondHalfAwayTeamGoals);

        games.push(objGame);
        const objGame2 = {};
        objGame2.homeTeamShots = parseInt(item[headers.indexOf('HS')], 10);
        objGame2.awayTeamShots = parseInt(item[headers.indexOf('AS')], 10);
        objGame2.homeTeamShotsOnTarget = parseInt(item[headers.indexOf('HST')], 10);
        objGame2.awayTeamShotsOnTarget = parseInt(item[headers.indexOf('AST')], 10);
        // objGame2.homeTeamHitWoodwork = parseInt(item[headers.indexOf('HHW')], 10); // not exist in E0.csv in header
        // objGame2.awayTeamHitWoodwork = parseInt(item[headers.indexOf('AHW')], 10); // not exist in E0.csv in header
        objGame2.homeTeamCorners = parseInt(item[headers.indexOf('HC')], 10);
        objGame2.awayTeamCorners = parseInt(item[headers.indexOf('AC')], 10);
        objGame2.homeTeamFouls = parseInt(item[headers.indexOf('HF')], 10);
        objGame2.awayTeamFouls = parseInt(item[headers.indexOf('AF')], 10);
        // objGame2.homeTeamOffsides = parseInt(item[headers.indexOf('HO')], 10); // not exist in E0.csv in header
        // objGame2.awayTeamOffsides = parseInt(item[headers.indexOf('AO')], 10); // not exist in E0.csv in header
        objGame2.homeTeamYellowCards = parseInt(item[headers.indexOf('HY')], 10);
        objGame2.awayTeamYellowCards = parseInt(item[headers.indexOf('AY')], 10);
        objGame2.homeTeamRedCards = parseInt(item[headers.indexOf('HR')], 10);
        objGame2.awayTeamRedCards = parseInt(item[headers.indexOf('AR')], 10);
        objGame2.referee = item[headers.indexOf('Referee')];
        const copyOfObj = Object.assign({}, objGame)
        const assigned = Object.assign(copyOfObj, objGame2);
        gamesFull.push(assigned);
    });// end arr.forEach

    let teams = [];
    for (let i = 0; i < resultArr.length; i++) {
      if (teams.length === 20) {
        break;
      }
      const team = resultArr[i].HomeTeam;
      if (teams.indexOf(team) === -1) {
        teams.push(team);
      }
    }

    teams.sort();
    teams.forEach((team, i) => {
      const obj = {};
      obj.id = i;
      obj.name = team;
      // push team object to teamsList array
      teamsList.push(obj);

      const teamData = {};
      teamData.id = i;
      teamData.name = team;
      teamData.games = 0;
      teamData.gamesHome = 0;
      teamData.gamesAway = 0;
      teamData.wins = 0;
      teamData.losses = 0;
      teamData.draws = 0;
      teamData.goalsHome = 0;
      teamData.goalsAway = 0;

      teamData.goalsHomeAllowed = 0;
      teamData.goalsAwayAllowed = 0;

      teamData.pointsHome = 0;
      teamData.pointsAway = 0;

      teamData.winsHome = 0;
      teamData.lossesHome = 0;
      teamData.drawsHome = 0;

      teamData.winsAway = 0;
      teamData.lossesAway = 0;
      teamData.drawsAway = 0;

      teamData.form = [];
      teamData.formHome = [];
      teamData.formAway = [];

      resultArr.forEach((item, i, arr) => {
        if (item.HomeTeam !== team && item.AwayTeam !== team) {
          return;
        }
        if (item.HomeTeam === team) {// home team
          teamData.games ++;
          teamData.gamesHome ++;
          teamData.goalsHome += parseInt(item.FTHG, 10);
          teamData.goalsHomeAllowed += parseInt(item.FTAG, 10);
          if (item.FTR === 'H') {
            teamData.wins++;
            teamData.winsHome++;
            teamData.pointsHome += 3;
            teamData.form.push('W');
            teamData.formHome.push('W');
          } else if (item.FTR === 'A') {
            teamData.losses++;
            teamData.lossesHome++;
            teamData.form.push('L');
            teamData.formHome.push('L');
          } else if (item.FTR === 'D') {
            teamData.draws++;
            teamData.drawsHome++;
            teamData.pointsHome += 1;
            teamData.form.push('D');
            teamData.formHome.push('D');
          }
        } else if (item.AwayTeam === team) {// away team
          teamData.games ++;
          teamData.gamesAway ++;
          teamData.goalsAway += parseInt(item.FTAG, 10);
          teamData.goalsAwayAllowed += parseInt(item.FTHG, 10);
          if (item.FTR === 'H') {
            teamData.losses++;
            teamData.lossesAway++;
            teamData.form.push('L');
            teamData.formAway.push('L');
          } else if (item.FTR === 'A') {
            teamData.wins++;
            teamData.winsAway++;
            teamData.pointsAway += 3;
            teamData.form.push('W');
            teamData.formAway.push('W');
          } else if (item.FTR === 'D') {
            teamData.draws++;
            teamData.drawsAway++;
            teamData.pointsAway += 1;
            teamData.form.push('D');
            teamData.formAway.push('D');
          }
        }
      });// end resultArr.forEach

      teamData.goalsTotal = teamData.goalsHome + teamData.goalsAway;
      teamData.goalsTotalAllowed = teamData.goalsHomeAllowed + teamData.goalsAwayAllowed;
      teamData.pointsTotal = (teamData.wins * 3) + (teamData.draws);
      standings.push(teamData);
    });// end teams.forEach

    // If any clubs finish with the same number of points, their position in the Premier League table is determined by:
    // 1) goal difference
    // 2)the number of goals scored
    // 3) If the teams still cannot be separated, they will be awarded the same position in the table.
    standings.sort((a, b) => {
      return b.pointsTotal - a.pointsTotal || (b.goalsTotal - b.goalsTotalAllowed) - (a.goalsTotal - a.goalsTotalAllowed) || b.goalsTotal - a.goalsTotal;
    });


    // prepare data before insert to DB
    let resData = {
      season: metaData.season,
      country: fileNameToCountryName[metaData.league],
      league: metaData.league,
      leagueName: fileNameToLeagueName[metaData.league],
      standings: standings,
      teams: teamsList,
      games: games,
      gamesFull: gamesFull
    };

    MongoClient.connect(connectionUrl, (err, client) => {
      client.db(dbName).collection(collectionName).findOne({
        season: resData.season,
        country: resData.country,
        league: resData.league
      }, (err, result) => {
        if (err) {
          res.send(err);
          client.close();
        }

        if (result.games.length === resData.games.length) {
          console.log(`document ${result.season}-${result.country}-${result.league} is up to update`);
          resolve(true);
          return;
        }

        MongoClient.connect(connectionUrl, (err, client) => {
          client.db(dbName).collection(collectionName).updateOne({
            season: resData.season,
            country: resData.country,
            league: resData.league,
          },
          { $set: { standings: resData.standings, games: resData.games, gamesFull: resData.gamesFull } },
          (err, result) => {
            if (err) {
              res.send(err);
              client.close();
            }
            console.log(`document ${result.season}-${result.country}-${result.league} has been updated`);
            resolve(true);
          });
        });
      });
    });

    });// end results.forEach(() => {
  });
}

module.exports.parseDataAndWrite = parseDataAndWrite;
