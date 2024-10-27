class SoundGraph {
    constructor() {
        this.nodes = new Map();
    }

    addNode(name, loop=0, silence=0) {
        this.nodes.set(name, { name, loop, edges: [], totalWeight: 0 });
    }

    addEdge(from, to, weight = 1, silence=0) {
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
    getNext(name) {
        const node = this.nodes.get(name);
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
}

export default SoundGraph