****Football Simulation Project****
We import teams using a JSON file, which is processed by the program to generate a football tournament simulation.
The application simulates matches, calculates team strength, and displays rankings and results.

**Project Structure**
project/
│
├── index.html
├── script.ts
├── script.js (generated)
├── teams.json
└── README.md

**Input (JSON Format)**
Teams are defined in a JSON file.

**How it works**
Teams are loaded from a JSON file
The program calculates match outcomes based on team strength
Matches are simulated automatically
Results are displayed in a ranking table

**Setup**
Install TypeScript:
`npm install -g typescript`
Compile TypeScript:
`tsc script.ts --watch`
Open index.html in a browser
(or use Live Server in VS Code)

**Features**
JSON-based team import
Dynamic match simulation
Team strength calculation
Automatic ranking system

**Future Improvements**
Group stage + knockout system
Better match randomness
UI improvements (tables, animations)
Save results locally
