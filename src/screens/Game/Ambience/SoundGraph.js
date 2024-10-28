import { pickOne } from "@lib/utils/math";

class SoundGraph {
    constructor() {
        this.nodes = new Map();
    }

    addNode(name, loop=0) {
        this.nodes.set(name, { name, loop, edges: [], totalWeight: 0 });
    }

    addEdge(from, to, weight = 1, silence=0) {
        // console.log({ from, to })
        const fromNode = this.nodes.get(from);
        fromNode.edges.push({ to, weight, silence });
        fromNode.totalWeight = null; // Invalidate cached weight
    }

    commit() {
        // Cache total weight for each node
        for (const node of this.nodes.values()) {
            node.totalWeight = node.edges.reduce((sum, edge) => sum + edge.weight, 0);
        }
    }

    get(name) {
        return this.nodes.get(name);
    }
    getNext(lastNode) {
        const node = this.nodes.get(typeof lastNode === "string" ? lastNode: lastNode.name);
        if (!node || node.edges.length === 0) return null;

        const totalWeight = node.totalWeight;
        if (totalWeight === 0) return null;

        let random = Math.random() * totalWeight;

        for (const edge of node.edges) {
            random -= edge.weight;
            if (random <= 0) {
                return { node: this.nodes.get(edge.to), edge: edge };
            }
        }

        return null;
    }
    getRandom() {
        const keys = Array.from(this.nodes.keys());
        const randomKey = pickOne(keys);
        return this.nodes.get(randomKey);
    }
}

export default SoundGraph