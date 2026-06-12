import { assertEquals } from "@std/assert";

Deno.test("Assign strength number to teams.", () => {
  //Arrange
  const teams: string[] = [
    "Team1",
    "Team2",
    "Team3",
    "Team4",
    "Team5",
    "Team6",
    "Team7",
    "Team8",
    "Team9",
  ];

  //Act
  const strengthMap: Map<string, number> =
    teamStrengthCalc.assignStrength(teams);

  //Assert
  for (let i = teams.length; i >= 0; i--) {
    assertEquals(strengthMap.get(teams[i]), i);
  }
});
