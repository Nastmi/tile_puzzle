export class Scene {

    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    removeNode(node) {
        let idx = this.nodes.indexOf(node);
        this.nodes.splice(idx, 1);
    }

    traverse(before, after) {
        this.nodes.forEach(node => node.traverse(before, after));
    }

}
