import SoundGraph from "../SoundGraph";

const graph = new SoundGraph()

graph.addNode("mel2_1")
graph.addNode("mel2_2", [2,4])
graph.addNode("mel2_3")

graph.addEdge("mel2_1", "mel2_2", 1)

graph.addEdge("mel2_2", "mel")