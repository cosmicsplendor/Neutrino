const states = ["Forest", "Mountain", "River"];
const transitionMatrix = {
  "Forest": { "Forest": 0.7, "Mountain": 0.2, "River": 0.1 },
  "Mountain": { "Forest": 0.3, "Mountain": 0.5, "River": 0.2 },
  "River": { "Forest": 0.4, "Mountain": 0.1, "River": 0.5 }
};

let currentState = "Forest";
let terrainSequence = [currentState];

for (let i = 0; i < 10; i++) {
  const rand = Math.random();
  let cumulativeProbability = 0.0;

  for (const nextState in transitionMatrix[currentState]) {
    cumulativeProbability += transitionMatrix[currentState][nextState];
    if (rand < cumulativeProbability) {
      currentState = nextState;
      terrainSequence.push(currentState);
      break;
    }
  }
}

console.log(terrainSequence);