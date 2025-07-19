import * as THREE from 'three';
import { Color, TileView } from './TileView';
import { rotateMatrix180, rotateMatrixClockwise, rotateMatrixCounterClockwise } from '../utils/matrixUtils';

// determines whether the rotation is clockwise, counterclockwise, or double
export enum Direction {
    regular,
    prime,
    double
}

// indexes in cubeData for each side of the cube, treating white as the bottom and blue as the front
export enum Side {
    bottom = 0,
    front = 1,
    left = 2,
    back = 3,
    right = 4,
    top = 5
}

// A rotation will have both a side and a direction
export type Rotation = {
    direction: Direction,
    side: Side
    amountRotated: number
}

export class CubeView {
    private dim: number;
    // private cubeData: Color[][][] = [];
    private cubeData: TileView[][][] = [];
    private cube: THREE.Group = new THREE.Group();
    colors = [Color.white, Color.blue, Color.orange, Color.green, Color.red, Color.yellow];

    // used internally for keeping track of the current rotation and when the cube is being rotated
    private rotating: boolean = true
    private currentRotation: Rotation = {
        direction: Direction.double,
        side: Side.front,
        amountRotated: 0
    }

    constructor(dim: number) {
        this.dim = Math.round(dim);

        // initialize cubeData to solved state & set up visualization
        for (let i = 0; i < 6; i++) {
            const temp2d = [];
            for (let r = 0; r < dim; r++) {
                const temp1d = [];
                for (let c = 0; c < dim; c++) {
                    const tile = new TileView(this.colors[i]);

                    // rotate tile correctly
                    const side = i as Side;
                    tile.rotateBySide(side);

                    // position tile correctly
                    if (side === Side.front) {
                        tile.mesh.position.y = c;
                        tile.mesh.position.x = r;
                    }
                    if (side === Side.back) {
                        tile.mesh.position.y = c;
                        tile.mesh.position.x = r;
                        tile.mesh.position.z = -dim;
                    }

                    if (side === Side.left) {
                        tile.mesh.position.z = r;
                        tile.mesh.position.y = c;
                        // line up with the borders of the front and back
                        tile.mesh.position.z += 0.5 - dim;

                        tile.mesh.position.x -= 0.5;

                    }
                    if (side === Side.right) {
                        tile.mesh.position.z = r;
                        tile.mesh.position.y = c;
                        // line up with the borders of the front and back
                        tile.mesh.position.z += 0.5 - dim;

                        tile.mesh.position.x += dim - 0.5;
                    }

                    if (side === Side.top) {
                        tile.mesh.position.y += dim - 0.5;
                        tile.mesh.position.x = r;
                        tile.mesh.position.z = c; // have the physical rotations match what you expect to happen in the matrix

                        // line up with the borders of the front and back
                        tile.mesh.position.z += 0.5 - dim;
                    }
                    if (side === Side.bottom) {
                        tile.mesh.position.y -= 0.5;
                        tile.mesh.position.x = r;
                        tile.mesh.position.z = c;

                        // line up with the borders of the front and back
                        tile.mesh.position.z += 0.5 - dim;
                    }

                    // add to cube group
                    this.cube.add(tile.mesh);

                    // add to cubeData
                    temp1d.push(tile);
                }
                temp2d.push(temp1d);
            }
            this.cubeData.push(temp2d);
        }

        // temporary for testing
        // this.cubeData[Side.front][2][0].setColor(Color.white)

        // offset all children to be centered at (0, 0, 0) which allows for easier rotation
        const center = this.getCenterPoint()
        this.cube.children.forEach((child) => {
            child.position.sub(center)
        })
    }

    update(delta: number) {
        // this.rotating = true // temporary for testing

        // if (!this.rotating) {
        //     this.currentRotation = {
        //         direction: Direction.regular,
        //         side: Side.front,
        //         amountRotated: 0
        //     }
        //     this.rotating = true
        // }

        if (this.rotating) {
            this.f(delta)
        }
    }

    getCube() {
        return this.cube;
    }

    f(delta: number) {
        const { direction } = this.currentRotation
        // visualization
        const group = new THREE.Group()
        this.cubeData[Side.front].flat().forEach(element => {
            // this.cube.remove(element.mesh)
            group.add(element.mesh)
        });

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData[Side.top][i][this.dim - 1].mesh)
            group.add(this.cubeData[Side.bottom][i][this.dim - 1].mesh)
            group.add(this.cubeData[Side.left][this.dim - 1][i].mesh)
            group.add(this.cubeData[Side.right][this.dim - 1][i].mesh)
        }

        let maxAngle = Math.PI / 2
        if (direction === Direction.double) {
            maxAngle = Math.PI

            // make rotation go twice as fast if doing a double turn
            delta *= 2
        }

        if (this.currentRotation.amountRotated + delta >= maxAngle) {
            // stop rotating and snap to wherever the turn is supposed to bring you
            this.rotating = false
            delta = maxAngle - this.currentRotation.amountRotated
        }
        this.currentRotation.amountRotated += delta

        group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), direction === Direction.prime ? delta : -delta)
        group.updateMatrixWorld(true)


        while (group.children.length > 0) {
            const element = group.children[0]
            // update the world matrix based on the transformations made within the group
            element.updateMatrixWorld(true)
            element.matrix.copy(element.matrixWorld)
            element.matrix.decompose(element.position, element.quaternion, element.scale)
            element.matrixAutoUpdate = true

            // group.remove(element)
            this.cube.add(element)
        }

        // data
        if (direction === Direction.regular) {
            rotateMatrixClockwise(this.cubeData[Side.front])
        } else if (direction === Direction.prime) {
            rotateMatrixCounterClockwise(this.cubeData[Side.front])
        } else if (direction === Direction.double) {
            rotateMatrix180(this.cubeData[Side.front])
        }
        // update the top, left, bottom, and right bordering the front
    }

    /**
     * @returns the width/height of the cube.
     */
    getDimensions() {
        return this.dim;
    }

    getCenterPoint() {
        let middle = new THREE.Vector3();

        let geometry = new THREE.Box3();
        geometry.setFromObject(this.cube);

        middle.x = (geometry.max.x + geometry.min.x) / 2;
        middle.y = (geometry.max.y + geometry.min.y) / 2;
        middle.z = (geometry.max.z + geometry.min.z) / 2;

        this.cube.localToWorld(middle);
        return middle;
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

