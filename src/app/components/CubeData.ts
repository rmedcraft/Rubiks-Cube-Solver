import { rotateMatrix180, rotateMatrixClockwise, rotateMatrixCounterClockwise } from "../utils/matrixUtils";
import { Direction, Rotation, Side } from "./CubeView";
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

    rotateBySide(rotation: Rotation) {
        if (rotation.side === Side.front) {
            this.f(rotation)
        }
        if (rotation.side === Side.back) {
            this.b(rotation)
        }
        if (rotation.side === Side.left) {
            this.l(rotation)
        }
        if (rotation.side === Side.right) {
            this.r(rotation)
        }
        if (rotation.side === Side.top) {
            this.u(rotation)
        }
        if (rotation.side === Side.bottom) {
            this.d(rotation)
        }
    }

    /**
     * Handles rotation of just the face of the cube, not the edges bordering it
     * @param rotation Rotation object of the current rotation
     */
    rotateFace(rotation: Rotation) {
        const side = rotation.side

        if (rotation.direction === Direction.regular) {
            if (side === Side.left || side === Side.bottom || side === Side.front) {
                rotateMatrixCounterClockwise(this.cubeData[side])
            } else {
                rotateMatrixClockwise(this.cubeData[side])
            }
            // rotateMatrixCounterClockwise(this.cubeData[side])
        }
        if (rotation.direction === Direction.prime) {
            if (side === Side.left || side === Side.bottom || side === Side.front) {
                rotateMatrixClockwise(this.cubeData[side])
            } else {
                rotateMatrixCounterClockwise(this.cubeData[side])
            }
            // rotateMatrixClockwise(this.cubeData[side])
        }
        if (rotation.direction === Direction.double) {
            rotateMatrix180(this.cubeData[side])
        }
    }

    // lets all just write shitty code and die

    f(rotation: Rotation) {
        if (rotation.side !== Side.front) return

        this.rotateFace(rotation)

        for (let i = 0; i < this.dim; i++) {
            // (0, 2) on the top goes to (2, 2) on the right
            // (2, 2) on the right goes to (2, 2) on the bottom
            // (2, 2) on the bottom goes to (2, 0) on the left
            // (2, 0) on the left goes to (0, 2) on the top

            // (2, 2) on the top goes to (2, 0) on the right
            // (2, 0) on the right goes to (0, 2) on the bottom
            // (0, 2) on the bottom goes to (2, 2) on the left
            // (2, 2) on the left goes to (2, 2) on the right

            // for front
            // - top & left start from the start, bottom & right start from the end
            // - top & bottom increment x, [max][i]
            // - left and right increment y, [i][max]  

            // (0, 2) on the top would move to (2, 2) on the bottom, see documents/cubeLayout.txt
            const top = this.cubeData[Side.top][this.dim - 1][i]
            const bottom = this.cubeData[Side.bottom][this.dim - 1][this.dim - 1 - i]

            const left = this.cubeData[Side.left][i][this.dim - 1]
            const right = this.cubeData[Side.right][this.dim - 1 - i][this.dim - 1]

            if (rotation.direction === Direction.regular) {
                // top -> right
                this.cubeData[Side.right][this.dim - 1 - i][this.dim - 1] = top
                // right -> bottom 
                this.cubeData[Side.bottom][this.dim - 1][this.dim - 1 - i] = right
                // bottom -> left
                this.cubeData[Side.left][i][this.dim - 1] = bottom
                // left -> top
                this.cubeData[Side.top][this.dim - 1][i] = left
            }
            if (rotation.direction === Direction.prime) {
                // top -> left
                this.cubeData[Side.left][i][this.dim - 1] = top
                // left -> bottom
                this.cubeData[Side.bottom][this.dim - 1][this.dim - 1 - i] = left
                // bottom -> right
                this.cubeData[Side.right][this.dim - 1 - i][this.dim - 1] = bottom
                // right -> top
                this.cubeData[Side.top][this.dim - 1][i] = right
            }
            if (rotation.direction === Direction.double) {
                // top -> bottom
                this.cubeData[Side.bottom][this.dim - 1][this.dim - 1 - i] = top
                // bottom -> top
                this.cubeData[Side.top][this.dim - 1][i] = bottom
                // left -> right
                this.cubeData[Side.right][this.dim - 1 - i][this.dim - 1] = left
                // right -> left
                this.cubeData[Side.left][i][this.dim - 1] = right
            }
        }
    }

    b(rotation: Rotation) {
        if (rotation.side !== Side.back) return

        this.rotateFace(rotation)

        for (let i = 0; i < this.dim; i++) {
            // back side regular rotation
            // (2, 0) on the top goes to (0, 2) on the left
            // (0, 2) on the left goes to (0, 0) on the bottom
            // (0, 0) on the bottom goes to (0, 0) on the right
            // (0, 0) on the right goes to (0, 2) on the top

            // (0, 0) on the top goes to (0, 0) on the left
            // (0, 0) on the left goes to (2, 0) on the bottom
            // (2, 0) on the bottom goes to (0, 2) on the right
            // (0, 2) on the right goes to (0, 0) on the top
            // for back
            // - top & left start from the end, bottom & right start from the start
            // - top & bottom increment x, [0][i]
            // - left and right increment y, [i][0]  

            const top = this.cubeData[Side.top][0][this.dim - 1 - i]
            const bottom = this.cubeData[Side.bottom][0][i]

            const left = this.cubeData[Side.left][this.dim - 1 - i][0]
            const right = this.cubeData[Side.right][i][0]
            if (rotation.direction === Direction.regular) {
                // top -> left
                this.cubeData[Side.left][this.dim - 1 - i][0] = top
                // left -> bottom
                this.cubeData[Side.bottom][0][i] = left
                // bottom -> right
                this.cubeData[Side.right][i][0] = bottom
                // right -> top
                this.cubeData[Side.top][0][this.dim - 1 - i] = right
            }
            if (rotation.direction === Direction.prime) {
                // top -> right
                this.cubeData[Side.right][i][0] = top
                // right -> bottom
                this.cubeData[Side.bottom][0][i] = right
                // bottom -> left
                this.cubeData[Side.left][this.dim - 1 - i][0] = bottom
                // left -> top
                this.cubeData[Side.top][0][this.dim - 1 - i] = left
            }
            if (rotation.direction === Direction.double) {
                // top -> bottom
                this.cubeData[Side.bottom][0][i] = top
                // bottom -> top
                this.cubeData[Side.top][0][this.dim - 1 - i] = bottom
                // left -> right
                this.cubeData[Side.right][i][0] = left
                // right -> left
                this.cubeData[Side.left][this.dim - 1 - i][0] = right
            }
        }
    }

    l(rotation: Rotation) {
        if (rotation.side !== Side.left) return

        this.rotateFace(rotation)

        for (let i = 0; i < this.dim; i++) {
            const top = this.cubeData[Side.top][i][0]
            const bottom = this.cubeData[Side.bottom][this.dim - 1 - i][0]
            const front = this.cubeData[Side.front][this.dim - 1 - i][0]
            const back = this.cubeData[Side.back][i][0]
            if (rotation.direction === Direction.prime) {
                // top -> back
                this.cubeData[Side.back][i][0] = top
                // back -> bottom
                this.cubeData[Side.bottom][this.dim - 1 - i][0] = back
                // bottom -> front
                this.cubeData[Side.front][this.dim - 1 - i][0] = bottom
                // front -> top
                this.cubeData[Side.top][i][0] = front
            }
            if (rotation.direction === Direction.regular) {
                // top -> front
                this.cubeData[Side.front][this.dim - 1 - i][0] = top
                // front -> bottom
                this.cubeData[Side.bottom][this.dim - 1 - i][0] = front
                // bottom -> back
                this.cubeData[Side.back][i][0] = bottom
                // back -> top
                this.cubeData[Side.top][i][0] = back
            }
            if (rotation.direction === Direction.double) {
                // top -> bottom
                this.cubeData[Side.bottom][this.dim - 1 - i][0] = top
                // bottom -> top
                this.cubeData[Side.top][i][0] = bottom
                // back -> front
                this.cubeData[Side.front][this.dim - 1 - i][0] = back
                // front -> back
                this.cubeData[Side.back][i][0] = front
            }
        }
    }

    r(rotation: Rotation) {
        if (rotation.side !== Side.right) return

        this.rotateFace(rotation)
        for (let i = 0; i < this.dim; i++) {
            const top = this.cubeData[Side.top][i][this.dim - 1]
            const bottom = this.cubeData[Side.bottom][this.dim - 1 - i][this.dim - 1]
            const front = this.cubeData[Side.front][this.dim - 1 - i][this.dim - 1]
            const back = this.cubeData[Side.back][i][this.dim - 1]

            if (rotation.direction === Direction.prime) {
                // top -> front
                this.cubeData[Side.front][this.dim - 1 - i][this.dim - 1] = top
                // front -> bottom
                this.cubeData[Side.bottom][this.dim - 1 - i][this.dim - 1] = front
                // bottom -> back
                this.cubeData[Side.back][i][this.dim - 1] = bottom
                // back -> top
                this.cubeData[Side.top][i][this.dim - 1] = back
            }
            if (rotation.direction === Direction.regular) {
                // top -> back
                this.cubeData[Side.back][i][this.dim - 1] = top
                // back -> bottom
                this.cubeData[Side.bottom][this.dim - 1 - i][this.dim - 1] = back
                // bottom -> front
                this.cubeData[Side.front][this.dim - 1 - i][this.dim - 1] = bottom
                // front -> top
                this.cubeData[Side.top][i][this.dim - 1] = front

            }
            if (rotation.direction === Direction.double) {
                // top -> bottom
                this.cubeData[Side.bottom][this.dim - 1 - i][this.dim - 1] = top
                // bottom -> top
                this.cubeData[Side.top][i][this.dim - 1] = bottom
                // back -> front
                this.cubeData[Side.front][this.dim - 1 - i][this.dim - 1] = back
                // front -> back
                this.cubeData[Side.back][i][this.dim - 1] = front

            }
        }
    }

    u(rotation: Rotation) {
        if (rotation.side !== Side.top) return

        this.rotateFace(rotation)
        for (let i = 0; i < this.dim; i++) {
            const left = this.cubeData[Side.left][this.dim - 1][i]
            const right = this.cubeData[Side.right][this.dim - 1][this.dim - 1 - i]
            const front = this.cubeData[Side.front][this.dim - 1][i]
            const back = this.cubeData[Side.back][this.dim - 1][this.dim - 1 - i]

            if (rotation.direction === Direction.regular) {
                // front -> left
                this.cubeData[Side.left][this.dim - 1][i] = front
                // left -> back
                this.cubeData[Side.back][this.dim - 1][this.dim - 1 - i] = left
                // back -> right
                this.cubeData[Side.right][this.dim - 1][this.dim - 1 - i] = back
                // right -> front
                this.cubeData[Side.front][this.dim - 1][i] = right
            }
            if (rotation.direction === Direction.prime) {
                // front -> right
                this.cubeData[Side.right][this.dim - 1][this.dim - 1 - i] = front
                // right -> back
                this.cubeData[Side.back][this.dim - 1][this.dim - 1 - i] = right
                // back -> left
                this.cubeData[Side.left][this.dim - 1][i] = back
                // left -> front
                this.cubeData[Side.front][this.dim - 1][i] = left

            }
            if (rotation.direction === Direction.double) {
                // front -> back
                this.cubeData[Side.back][this.dim - 1][this.dim - 1 - i] = front
                // back -> front
                this.cubeData[Side.front][this.dim - 1][i] = back
                // left -> right
                this.cubeData[Side.right][this.dim - 1][this.dim - 1 - i] = left
                // right -> left
                this.cubeData[Side.left][this.dim - 1][i] = right
            }
        }
    }

    d(rotation: Rotation) {
        if (rotation.side !== Side.bottom) return

        this.rotateFace(rotation)

        for (let i = 0; i < this.dim; i++) {
            const left = this.cubeData[Side.left][0][i]
            const right = this.cubeData[Side.right][0][this.dim - 1 - i]
            const front = this.cubeData[Side.front][0][i]
            const back = this.cubeData[Side.back][0][this.dim - 1 - i]

            if (rotation.direction === Direction.regular) {
                // front -> right
                this.cubeData[Side.right][0][this.dim - 1 - i] = front
                // right -> back
                this.cubeData[Side.back][0][this.dim - 1 - i] = right
                // back -> left
                this.cubeData[Side.left][0][i] = back
                // left -> front
                this.cubeData[Side.front][0][i] = left
            }
            if (rotation.direction === Direction.prime) {
                // front -> left
                this.cubeData[Side.left][0][i] = front
                // left -> back
                this.cubeData[Side.back][0][this.dim - 1 - i] = left
                // back -> right
                this.cubeData[Side.right][0][this.dim - 1 - i] = back
                // right -> front
                this.cubeData[Side.front][0][i] = right

            }
            if (rotation.direction === Direction.double) {
                // front -> back
                this.cubeData[Side.back][0][this.dim - 1 - i] = front
                // back -> front
                this.cubeData[Side.front][0][i] = back
                // left -> right
                this.cubeData[Side.right][0][this.dim - 1 - i] = left
                // right -> left
                this.cubeData[Side.left][0][i] = right

            }
        }
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