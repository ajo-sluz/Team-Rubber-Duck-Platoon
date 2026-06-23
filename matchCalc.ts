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
  homeAdvantagePercent: number = 15
): MatchResult[] {
  const results: MatchResult[] = [];
  for (let i = 0; i < matchPlan.length; i++) {
    const homeTeamName: string = matchPlan[i].home;
    const homeTeamFactor: number = strengthMap.get(homeTeamName) ?? 1;
    const awayTeamName = matchPlan[i].away;
    const awayTeamFactor = strengthMap.get(awayTeamName) ?? 1;
    const goals: number[] = calculateGoals(
      homeTeamFactor,
      awayTeamFactor,
      maxGoals,
      minGoals,
      expectedGoals,
      homeAdvantagePercent
    );
    results.push({
      homeTeamName: homeTeamName,
      awayTeamName: awayTeamName,
      homeTeamGoals: goals[0],
      awayTeamGoals: goals[1],
      round: matchPlan[i].round,
    });
  }
  return results;
}

//Calculates to goals for a single match
function calculateGoals(
  homeTeamFactor: number,
  awayTeamFactor: number,
  maxGoals: number,
  minGoals: number,
  expectedGoals: number,
  homeAdvantagePercent: number,
): number[] {
  const minToExpected: number = expectedGoals - minGoals;
  const expectedToMaxRange: number = maxGoals - expectedGoals;
  const goalRangeTotal: number =
    Math.abs(minToExpected) + Math.abs(expectedToMaxRange);
  const teamFactorDifference: number = Math.abs(homeTeamFactor - awayTeamFactor);
  const homeAdvantageFactor: number = (homeAdvantagePercent / 100) + 1

  let goalsHome: number = 0;
  let goalsAway: number = 0;
  for (let i = 0; i <= maxGoals; i++) {
    let goalChancePercent: number = 0;
    if (i < minGoals) {
      goalChancePercent = 100;
    } else {
      goalChancePercent = Math.round(teamFactorDifference * 100);
      const currentGoals: number = goalsHome + goalsAway;
      const multOffsetAbsolute: number = 1 - currentGoals / goalRangeTotal;
      if (currentGoals <= expectedGoals) {
        goalChancePercent = goalChancePercent * (1 + multOffsetAbsolute);
      } else {
        goalChancePercent = goalChancePercent * (1 - multOffsetAbsolute);
      }
    }
    if (Math.round(Math.random() * 100) <= goalChancePercent) {
      let goalAssigned: boolean = false;
      let homeScore: number = 0;
      let awayScore: number = 0;
      while (!goalAssigned) {
        homeScore = Math.round(homeScore + (Math.random() * 100 * homeTeamFactor * homeAdvantageFactor));
        awayScore = Math.round(awayScore + (Math.random() * 100 * awayTeamFactor));
        if (homeScore >= 100 || awayScore >= 100) {
          if (homeScore === awayScore) {
            if (Math.random() < 0.5) {
              goalsHome++;
            } else {
              goalsAway++;
            }
          } else if (homeScore > awayScore) {
            goalsHome++;
          } else {
            goalsAway++;
          }
          goalAssigned = true;
        }
      }
    }
  }
  return [goalsHome, goalsAway];
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
