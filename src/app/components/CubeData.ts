import { Side } from "./CubeView";
import { Color, TileView } from "./TileView";

export const colors = [Color.white, Color.blue, Color.orange, Color.green, Color.red, Color.yellow];


export class CubeData {
    private cubeData: TileView[][][] = [];
    private dim: number;

    constructor(dim: number) {
        this.dim = Math.floor(dim)

        for (let i = 0; i < 6; i++) {
            const temp2d = [];
            for (let r = 0; r < this.dim; r++) {
                const temp1d = [];
                for (let c = 0; c < this.dim; c++) {
                    const tile = new TileView(colors[i]);
                    temp1d.push(tile)
                }
                temp2d.push(temp1d)
            }
            this.cubeData.push(temp2d)
        }
    }

    getSide(side: Side) {
        return this.cubeData[side]
    }

    /**
     * prints the state of the cube by printing the 3d array that represents the cube
     */
    printCube() {
        for (let i = 0; i < this.cubeData.length; i++) {
            // print 2d array
            const arr = this.cubeData[i];
            console.log("{");
            for (let r = 0; r < this.dim; r++) {
                let line = "";
                for (let c = 0; c < arr[0].length; c++) {
                    line += arr[r][c].getColor() + ", ";
                }
                console.log("\t" + line + "\n");
            }
            console.log("}");
        }
    }
}