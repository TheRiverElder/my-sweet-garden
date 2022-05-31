export interface GrowStrategy {
    
    /**
     * 
     * @param input [age, selfType ,position, basePosition, nextCount, terminalNextCount]
     * @returns [growLength, nextPartType, nextBranchAngle]
     */
    grow(input: number[]): number[];
}