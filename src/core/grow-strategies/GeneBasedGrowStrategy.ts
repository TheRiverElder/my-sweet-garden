import type { GrowStrategy } from "./GrowStrategy";

export class GeneBasedGrowStrategy implements GrowStrategy {

    public static fromGene(gene: number[]): GeneBasedGrowStrategy {
        let geneIndex = 0;
        const layerCount = gene[geneIndex++];
        const nodeCountsOfEachLayer = gene.slice(geneIndex, geneIndex + layerCount);
        geneIndex += layerCount;
        const inputLayerNodeCount = 6;
        let prevNodeCount = inputLayerNodeCount;
        const result: number[][][] = [];
        for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
            const nodeCount = nodeCountsOfEachLayer[layerIndex];
            const nodesInLayer: number[][] = [];
            for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
                const node = gene.slice(geneIndex, geneIndex + prevNodeCount + 1);
                nodesInLayer.push(node);
                geneIndex += prevNodeCount;
            }
            result.push(nodesInLayer);
            prevNodeCount = nodeCount;
        }
        return new GeneBasedGrowStrategy(result);
    }
    
    private layers: number[][][];

    constructor(layers: number[][][]) {
        this.layers = layers;
    }
    
    /**
     * 
     * @param input [age, selfType ,position, basePosition, nextCount, terminalNextCount]
     * @returns [growLength, nextPartType, nextBranchAngle]
     */
    grow(input: number[]) {
        let inputArray = input;
        let outputArray: number[];
        for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
            const layer = this.layers[layerIndex];
            outputArray = [];
            for (const node of layer) {
                let o = 0;
                for (let i = 0; i < node.length - 1; i++) {
                    o += node[i] * inputArray[i];
                }
                o += node[node.length - 1];
                outputArray.push(layerIndex >= this.layers.length - 1 ? o : sigmoid(o));
            }
            // res = layer.map(node => sigmoid(numberSum(node.slice(0, node.length - 1).map((w, i) => w * (res[i] || 0)))) + node[node.length - 1]);
            inputArray = outputArray;
        }
        return outputArray;
    }
}

function sigmoid(x: number): number {
    return 1.0 / (1.0 + Math.exp(-x));
}
