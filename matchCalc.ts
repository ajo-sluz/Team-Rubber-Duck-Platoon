import { Team, Match } from './spielplan.ts'

//Return type
export type MatchResult = {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
  round: number;
};

//Function to call, returns results
export function getMatchResults(teams: Team[], matchPlan: Match[]): MatchResult[] {
  const strengthMap: Map<string, number> = assignStrength(teams);
  const results: MatchResult[] = calculateResults(strengthMap, matchPlan);
  return results;
}

//Calculates results of all matches defined in matchPlan
function calculateResults(
  strengthMap: Map<string, number>,
  matchPlan: Match[],
  maxGoals: number = 5,
  minGoals: number = 0,
  expectedGoals: number = 3,
): MatchResult[] {
  const results: MatchResult[] = [];
  for (let i = 0; i < matchPlan.length; i++) {
    const team1Name: string = matchPlan[i].home;
    const team1Factor: number = strengthMap.get(team1Name) ?? 1;
    const team2Name = matchPlan[i].away;
    const team2Factor = strengthMap.get(team2Name) ?? 1;
    const goals: number[] = calculateGoals(
      team1Factor,
      team2Factor,
      maxGoals,
      minGoals,
      expectedGoals,
    );
    results.push({
      homeTeamName: team1Name,
      awayTeamName: team2Name,
      homeTeamGoals: goals[0],
      awayTeamGoals: goals[1],
      round: matchPlan[i].round,
    });
  }
  return results;
}

//Calculates to goals for a single match
function calculateGoals(
  team1Factor: number,
  team2Factor: number,
  maxGoals: number,
  minGoals: number,
  expectedGoals: number,
): number[] {
  const minToExpected: number = expectedGoals - minGoals;
  const expectedToMaxRange: number = maxGoals - expectedGoals;
  const goalRangeTotal: number =
    Math.abs(minToExpected) + Math.abs(expectedToMaxRange);
  const teamFactorDifference = Math.abs(team1Factor - team2Factor);

  let goalsTeam1: number = 0;
  let goalsTeam2: number = 0;
  for (let i = 0; i <= maxGoals; i++) {
    let goalChancePercent: number = 0;
    if (i < minGoals) {
      goalChancePercent = 100;
    } else {
      goalChancePercent = Math.round(teamFactorDifference * 100);
      const currentGoals: number = goalsTeam1 + goalsTeam2;
      const multOffsetAbsolute: number = 1 - currentGoals / goalRangeTotal;
      if (currentGoals <= expectedGoals) {
        goalChancePercent = goalChancePercent * (1 + multOffsetAbsolute);
      } else {
        goalChancePercent = goalChancePercent * (1 - multOffsetAbsolute);
      }
    }
    if (Math.round(Math.random() * 100) <= goalChancePercent) {
      let goalAssigned: boolean = false;
      let team1Score: number = 0;
      let team2Score: number = 0;
      while (!goalAssigned) {
        team1Score = Math.round(team1Score + Math.random() * 100 * team1Factor);
        team2Score = Math.round(team2Score + Math.random() * 100 * team2Factor);
        if (team1Score >= 100 || team2Score >= 100) {
          if (team1Score === team2Score) {
            if (Math.random() < 0.5) {
              goalsTeam1++;
            } else {
              goalsTeam2++;
            }
          } else if (team1Score > team2Score) {
            goalsTeam1++;
          } else {
            goalsTeam2++;
          }
          goalAssigned = true;
        }
      }
    }
  }
  return [goalsTeam1, goalsTeam2];
}

//Assigns team-strength factor/multiplier based on list position
function assignStrength(
  teams: Team[],
  maxStrengthDifference: number = 50,
): Map<string, number> {
  const strengthMap: Map<string, number> = new Map<string, number>();
  const teamCount: number = teams.length;

  const maxStrengthValue = teamCount * (maxStrengthDifference / 100 + 1);

  for (let i = teamCount; i > 0; i--) {
    const strengthFactor = (maxStrengthValue - i) / teamCount;
    strengthMap.set(teams[i - 1].name, strengthFactor);
  }
  return strengthMap;
}
