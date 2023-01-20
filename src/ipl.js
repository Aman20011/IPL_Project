const fs = require("fs");
let data = fs.readFileSync("../Data/matches.csv").toString().split('\r\n');

var arr = [];
for(let i = 1;i<data.length; i++){
   let nextArr = [];
   let row = data[i].split(",");
   for(let j = 0; j<row.length; j++){
     nextArr.push(row[j]);
   }
   arr.push(nextArr);
 }
 arr.pop();


let yearMatch = {};
let matchesWonPerTeamPerYear = {};

arr.forEach((match) => {
  let matchDate = match[2].split('-');
  if(yearMatch.hasOwnProperty(matchDate[0])){
    yearMatch[matchDate[0]]++;

    if(matchesWonPerTeamPerYear[matchDate[0]].hasOwnProperty(match[10])){
      matchesWonPerTeamPerYear[matchDate[0]][match[10]]++;
    }
    else matchesWonPerTeamPerYear[matchDate[0]][match[10]] = 1;
  }
  else {
    yearMatch[matchDate[0]] = 1;
    matchesWonPerTeamPerYear[matchDate[0]] = {};
    matchesWonPerTeamPerYear[matchDate[0]][match[10]] = 1;
  }
})

// ques-1: Number of matches played per year for all the years in IPL
console.log("\n");
console.log("**************************************************************************************");
console.log("\n * Number of matches played per year for all the years in IPL\n");
for(let year in yearMatch){
  console.log(year, yearMatch[year]);
}
console.log("\n");

// ques-2: Number of matches won of per team per year in IPL

console.log("**************************************************************************************");
console.log("\n * Number of matches won of per team per year in IPL.\n");
for(let year in matchesWonPerTeamPerYear){
  console.log(year, matchesWonPerTeamPerYear[year]);
}

const bowlingDataPerLine = fs.readFileSync("../Data/ballbyball.csv").toString().replace(/''/g,' ').split('\r\n');
 const bowlingData = [];
 for(let i = 1; i<bowlingDataPerLine.length; i++){
   let nextArr = [];
   let row = bowlingDataPerLine[i].split(',');
   for(let j = 0; j<row.length; j++){
     nextArr.push(row[j]);
  }
   bowlingData.push(nextArr);
}


const extrasPerTeam = {};
const bowlers = {};

arr.forEach((match)=>{
  let matchDate = match[2].split('-');
  if(matchDate[0] === '2016'){
    bowlingData.forEach((bowlingDetail)=>{
      if(bowlingDetail[0]==match[0]){
        if(extrasPerTeam.hasOwnProperty(bowlingDetail[bowlingDetail.length-1])){
          extrasPerTeam[bowlingDetail[bowlingDetail.length-1]]+=parseInt(bowlingDetail[8]);
        }
        else{
          extrasPerTeam[bowlingDetail[bowlingDetail.length-1]] = parseInt(bowlingDetail[8]);
        }
      }
    })
  }

  else if(matchDate[0] === '2015'){
    let totalRuns = "total runs";
    let totalOvers = "total overs";
    let economy = "Overall Economy";
    let bowlerMAXoverBowledInAMatch = {};
    bowlingData.forEach((bowlingDetail) => {
      if(bowlingDetail[0] == match[0]){
        if(bowlers.hasOwnProperty(bowlingDetail[6])){
          bowlers[bowlingDetail[6]][totalRuns] += parseInt(bowlingDetail[9]);

          let nextArr = [].concat(bowlerMAXoverBowledInAMatch[bowlingDetail[6]]);   
          let overBowled = false;
          let len = nextArr.length;
          for(let i = 0; i<len; i++){
            let over = nextArr[i];
            if(over == bowlingDetail[2]){
              overBowled = true;
            }
          }
          if(!overBowled){ 
            nextArr.push(bowlingDetail[2]);
            bowlerMAXoverBowledInAMatch[bowlingDetail[6]]= nextArr;
          }
        }
        else {
          bowlers[bowlingDetail[6]] = {};
          bowlers[bowlingDetail[6]][totalRuns] = parseInt(bowlingDetail[9]);
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

// ques-3: Extras conceded per team in 2016

console.log("\n*****************************************************************************************");
console.log("\n * Extras conceded per team in 2016\n");
for(let team in extrasPerTeam){
  console.log(team, extrasPerTeam[team]);
}

// ques-4: Top 10 economical bowlers in 2015

const bowlersArr = [];

for(let bowler in bowlers){
  bowlersArr.push([bowlers[bowler]["Overall Economy"], bowler]);
}

bowlersArr.sort((a, b) =>{
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
});

const economyBowlersTop10 = {};
for(let i = 0; i<10; i++){
  economyBowlersTop10[bowlersArr[i][1]]= bowlersArr[i][0];
}

console.log("\n***************************************************************************************");
console.log("\n * Top 10 economical bowlers in 2015\n");
for(let bestBowler in economyBowlersTop10){
  console.log(bestBowler, economyBowlersTop10[bestBowler]);
}
console.log("\n***************************************************************************************");