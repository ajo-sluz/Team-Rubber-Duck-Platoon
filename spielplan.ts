import teamsData from "./teams.json" with { type: "json" };

interface Team {
  name: string;
}

interface Match {
  home: string;
  away: string;
  round: number;
}

function generateSchedule(teams: Team[]): Match[] {
  const numTeams = teams.length;
  const totalRounds = numTeams - 1;
  const matchesPerRound = numTeams / 2;
  
  const schedule: Match[] = [];
  const teamList = [...teams];

  for (let round = 0; round < totalRounds; round++) {
    for (let matchIdx = 0; matchIdx < matchesPerRound; matchIdx++) {
      const homeIdx = (round + matchIdx) % (numTeams - 1);
      let awayIdx = (round + numTeams - 1 - matchIdx) % (numTeams - 1);

      if (matchIdx === 0) {
        awayIdx = numTeams - 1;
      }

      const isHome = (round + matchIdx) % 2 === 0;
      
      const homeTeam = isHome ? teamList[homeIdx].name : teamList[awayIdx].name;
      const awayTeam = isHome ? teamList[awayIdx].name : teamList[homeIdx].name;

      schedule.push({
        round: round + 1,
        home: homeTeam,
        away: awayTeam
      });
    }
  }

  const hinrundeCount = schedule.length;
  for (let i = 0; i < hinrundeCount; i++) {
    const match = schedule[i];
    schedule.push({
      round: match.round + totalRounds,
      home: match.away,
      away: match.home
    });
  }

  return schedule;
}

const matchPlan = generateSchedule(teamsData);

Deno.writeTextFileSync("./spielplan.json", JSON.stringify(matchPlan, null, 2));