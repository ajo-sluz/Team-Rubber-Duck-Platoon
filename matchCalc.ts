export type MatchResult = {
    team1Name: string,
    team2Name: string,
    team1Goals: number,
    team2Goals: number,
}

export function getMatchResults(teams: string[]): MatchResult[]{
    const strengthMap: Map<string, number> = assignStrength(teams);
    const results: MatchResult[] = calculateResults(teams, strengthMap);
    return results;
}

function calculateResults(
    teams: string[],
    strengthMap: Map<string,number>,
    maxGoals: number = 5,
    minGoals: number = 0,
    expectedGoals: number = 3): MatchResult[]{
        const results: MatchResult[] = [];
        for(let i = 0; i < teams.length; i++){
            const team1Name: string = teams[i];
            const team1Factor: number = strengthMap.get(team1Name) ?? 1;
            for(let j = 0; j < teams.length; j++){
                if(i != j){
                    const team2Name = teams[j]
                    const team2Factor = strengthMap.get(team2Name) ?? 1;
                    const goals: number[] = calculateGoals(team1Factor, team2Factor, maxGoals, minGoals, expectedGoals);
                    results.push({
                        team1Name: team1Name,
                        team2Name: team2Name,
                        team1Goals: goals[0],
                        team2Goals: goals[1],
                    });
                }
            }
        }
        return results;
}

function calculateGoals(
    team1Factor: number,
    team2Factor:number,
    maxGoals: number,
    minGoals: number,
    expectedGoals: number): number[]{
        const minToExpected: number = expectedGoals - minGoals;
        const expectedToMaxRange : number = maxGoals - expectedGoals;
        const goalRangeTotal: number = Math.abs(minToExpected) + Math.abs(expectedToMaxRange);
        const teamFactorDifference = Math.abs(team1Factor - team2Factor);

        let goalsTeam1: number = 0;
        let goalsTeam2: number = 0;
        for(let i = 0; i <= maxGoals; i++){
            let goalChancePercent: number = 0
            if(i < minGoals){
                goalChancePercent= 100;
            }
            else{
                goalChancePercent = Math.round(teamFactorDifference * 100);
                const currentGoals: number = goalsTeam1 + goalsTeam2;
                const multOffsetAbsolute: number = 1 -(currentGoals / goalRangeTotal);
                if(currentGoals <= expectedGoals){
                    goalChancePercent = goalChancePercent * (1 + multOffsetAbsolute);
                }
                else{
                    goalChancePercent = goalChancePercent * (1 - multOffsetAbsolute);
                }
            }
            if(Math.round(Math.random() * 100) <= goalChancePercent){
                let goalAssigned: boolean = false;
                let team1Score: number = 0;
                let team2Score: number = 0;
                while(!goalAssigned){
                    team1Score = Math.round(team1Score + ((Math.random() * 100) * team1Factor));
                    team2Score = Math.round(team2Score + ((Math.random() * 100) * team2Factor));
                    if(team1Score >= 100 || team2Score >= 100){
                        if(team1Score === team2Score){
                            if(Math.random() < 0.5){
                                goalsTeam1++;
                            }
                            else{
                                goalsTeam2++;
                            }
                        }
                        else if(team1Score > team2Score){
                            goalsTeam1++;
                        }
                        else{
                            goalsTeam2++;
                        }
                        goalAssigned = true;
                    }
                }
            }
        }
        return [goalsTeam1, goalsTeam2];
}

function assignStrength(teams: string[], maxStrengthDifference: number = 50): Map<string,number>{
    const strengthMap: Map<string, number> = new Map<string, number>();
    const teamCount: number = teams.length

    const maxStrengthValue = teamCount  * ((maxStrengthDifference / 100) + 1);
    
    for(let i = teamCount; i > 0; i--){
        const strengthFactor = (maxStrengthValue - i) / teamCount;
        strengthMap.set(teams[i - 1], strengthFactor);
    }
    return strengthMap
    
}

