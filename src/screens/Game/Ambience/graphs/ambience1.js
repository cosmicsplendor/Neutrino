import SoundGraph from "../SoundGraph";

const graph = new SoundGraph()

graph.addNode("mel2_1")
graph.addNode("mel2_2", [1,2])
graph.addNode("mel2_3")
graph.addNode("creepy")
graph.addNode("wind_1")
graph.addNode("wind_2")

graph.addEdge("mel2_1", "mel2_2", 1)

graph.addEdge("mel2_2", "mel2_3", 1)

graph.addEdge("mel2_3", "wind_2", 1, [4,6])
graph.addEdge("mel2_3", "wind_1", 1.5, [4,6])
graph.addEdge("mel2_3", "creepy", 1, [4, 4])

graph.addEdge("creepy", "wind_1", 1.5, [2, 3])
graph.addEdge("creepy", "wind_2", 1, [2, 3])

graph.addEdge("wind_1", "mel2_1", 1, [4,5])
graph.addEdge("wind_2", "mel2_1", 1, [4,5])

graph.commit()

export default graph