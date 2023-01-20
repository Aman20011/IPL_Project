
const fs = require("fs");

var csv = require('jquery-csv');
let data = fs.readFileSync("../Data/matches.csv").toString();

const matchArr = csv.toArrays(data);


let yearMatch = {};
let matchesWonPerTeamPerYear = {};

matchArr.forEach((match)=>{
  let curMatchDate = match[2].split('-');
  if(yearMatch.hasOwnProperty(curMatchDate[0])){
    yearMatch[curMatchDate[0]]++;

    if(matchesWonPerTeamPerYear[curMatchDate[0]].hasOwnProperty(match[10])){
      matchesWonPerTeamPerYear[curMatchDate[0]][match[10]]++;
    }
    else matchesWonPerTeamPerYear[curMatchDate[0]][match[10]] = 1;
  }
  else {
    yearMatch[curMatchDate[0]] = 1;
    matchesWonPerTeamPerYear[curMatchDate[0]] = {};
    matchesWonPerTeamPerYear[curMatchDate[0]][match[10]] = 1;
  }
})


console.log("***********************************************************************************");
console.log(" Ques 1: Number of matches played per year for all the years.");
for(let year in yearMatch){
  console.log(year, yearMatch[year]);
}
console.log("***********************************************************************************");


console.log("\n*********************************************************************************");
console.log("Ques 2: Number of matches won of per team per year in IPL");
for(let year in matchesWonPerTeamPerYear){
  console.log(year, matchesWonPerTeamPerYear[year]);
}
console.log("***********************************************************************************");


const BallData = fs.readFileSync("../Data/ballbyball.csv").toString();
const bowlingDetails = csv.toArrays(BallData);

const extraRunsPerTeam = {};
const bowlers = {};

matchArr.forEach((match)=>{
  let matchDate = match[2].split('-');
  if(matchDate[0] === '2016'){
    bowlingDetails.forEach((bowlingDetail)=>{
      if(bowlingDetail[0]==match[0]){
        if(extraRunsPerTeam.hasOwnProperty(bowlingDetail[bowlingDetail.length-1])){
          extraRunsPerTeam[bowlingDetail[bowlingDetail.length-1]]+=parseInt(bowlingDetail[8]);
        }
        else{
          extraRunsPerTeam[bowlingDetail[bowlingDetail.length-1]] = parseInt(bowlingDetail[8]);
        }
      }
    })
  }

  else if(matchDate[0] == '2015'){
    let totalRuns = "total runs";
    let totalOvers = "total overs";
    let economy = "Overall Economy";
    let bowlerMAXoverBowledInAMatch = {};
    bowlingDetails.forEach((bowlingDetail)=>{
      if(bowlingDetail[0] == match[0]){
        if(bowlers.hasOwnProperty(bowlingDetail[6])){
          bowlers[bowlingDetail[6]][totalRuns] += parseFloat(bowlingDetail[9]);
          
          let t = [].concat(bowlerMAXoverBowledInAMatch[bowlingDetail[6]]);
          
          let overBowled = false;
          let len = t.length;
          for(let i = 0; i<len; i++){
            let over = t[i];
            if(over === bowlingDetail[2]){
              overBowled = true;
            }
          }
          if(!overBowled){ 
            t.push(bowlingDetail[2]);
            bowlerMAXoverBowledInAMatch[bowlingDetail[6]]= t;
          }
        }
        else {
          bowlers[bowlingDetail[6]] = {};
          bowlers[bowlingDetail[6]][totalRuns] = parseFloat(bowlingDetail[9]);
          bowlers[bowlingDetail[6]][totalOvers] = 0;
          bowlerMAXoverBowledInAMatch[bowlingDetail[6]] = [bowlingDetail[2]];
          bowlers[bowlingDetail[6]][economy] = 0;
        }
      }
    })

    for(let bowlerName in bowlerMAXoverBowledInAMatch){
        bowlers[bowlerName][totalOvers]+= bowlerMAXoverBowledInAMatch[bowlerName].length;
        bowlers[bowlerName][economy] = bowlers[bowlerName][totalRuns]/ bowlers[bowlerName][totalOvers];
    }
  }
})


console.log("\n***********************************************************************************");
console.log("Ques 3: Extras conceded per team in 2016.");
for(let team in extraRunsPerTeam){
  console.log(team, extraRunsPerTeam[team]);
}
console.log("*************************************************************************************");


const bowlersArr = [];

for(let bowler in bowlers){
  bowlersArr.push([bowlers[bowler]["Overall Economy"], bowler]);
}

bowlersArr.sort((a, b) => a[0]-b[0]);

const economyBowlersTop10 = {};
for(let i = 0; i<10; i++){
  economyBowlersTop10[bowlersArr[i][1]]= bowlersArr[i][0];
}

console.log("\n**********************************************************************************");
console.log("Ques 4: Top 10 economical bowlers in 2015.");
for(let bestBowler in economyBowlersTop10){
  console.log(bestBowler, economyBowlersTop10[bestBowler]);
}
console.log("************************************************************************************");