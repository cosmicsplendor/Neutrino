import SoundGraph from "../SoundGraph";

const graph = new SoundGraph()

graph.addNode("jingl_2", [1,2])
graph.addNode("flute_amb_1")
graph.addNode("flute_amb_2")
graph.addNode("wind_1")
graph.addNode("wind_2")
graph.addNode("wind_3")
graph.addNode("jingl_1")
graph.addNode("creeepy")

graph.addEdge("jingl_2", "flute_amb_1", 1, [4,6])
graph.addEdge("jingl_2", "flute_amb_2", 1, [4,6])

graph.addEdge("flute_amb_1", "wind_3", 1, [5,7])
graph.addEdge("flute_amb_2", "wind_2", 1, [5,7])

graph.addEdge("wind_2", "jingl_1", 1, [5,8])
graph.addEdge("wind_3", "jingl_1", 1, [5,8])

graph.addEdge("jingl_1", "wind_1", 1, [4,6])

graph.addEdge("wind_1", "creepy", 1, [2,3])
graph.addEdge("creepy", "jingle_2", 1, [3,5])

graph.commit()

export default graph