import * as THREE from 'three';
import { Color, TileView } from './TileView';
import { dirxml } from 'console';


export class CubeView {
    private dim: number;
    private cubeData: Color[][][] = [];
    private tileArr: TileView[][][] = [];
    private cube: THREE.Group = new THREE.Group();
    colors = [Color.white, Color.blue, Color.orange, Color.green, Color.red, Color.yellow];

    constructor(dim: number) {
        this.dim = Math.round(dim);

        // initialize cubeData to solved state
        const colors = [Color.white, Color.blue, Color.orange, Color.green, Color.red, Color.yellow];
        for (let i = 0; i < 6; i++) {
            const temp2d = [];
            for (let r = 0; r < dim; r++) {
                const temp1d = [];
                for (let c = 0; c < dim; c++) {
                    temp1d.push(colors[i]);
                }
                temp2d.push(temp1d);
            }
            this.cubeData.push(temp2d);
        }

        // initialize cubeView using the cubeData 3d array
        for (let i = 0; i < 6; i++) {
            for (let r = 0; r < dim; r++) {
                for (let c = 0; c < dim; c++) {
                    const tile = new TileView();
                    tile.setColor(this.cubeData[i][r][c]);

                    // rotate tile correctly
                    const side = i as Side;
                    tile.rotateBySide(side);

                    // position tile correctly
                    if (side === Side.front || side === Side.back) {
                        tile.mesh.position.y = c;
                        tile.mesh.position.x = r;
                    }
                    if (side === Side.back) {
                        tile.mesh.position.z = -dim;
                    }

                    if (side === Side.left || side === Side.right) {
                        tile.mesh.position.z = r;
                        tile.mesh.position.y = c;

                        // line up with the borders of the front and back
                        tile.mesh.position.z += 0.5 - dim;
                    }
                    if (side === Side.left) {
                        tile.mesh.position.x -= 0.5;
                    }
                    if (side === Side.right) {
                        tile.mesh.position.x += dim - 0.5;
                    }

                    if (side === Side.top || side === Side.bottom) {
                        tile.mesh.position.x = c;
                        tile.mesh.position.z = r;

                        // line up with the borders of the front and back
                        tile.mesh.position.z += 0.5 - dim;
                    }

                    if (side === Side.top) {
                        tile.mesh.position.y += dim - 0.5;
                    }
                    if (side === Side.bottom) {
                        tile.mesh.position.y -= 0.5;
                    }


                    // add to cube group
                    // this.tileArr[i][r].push(tile);
                    this.cube.add(tile.mesh);
                }
            }
        }
    }

    getCube() {
        return this.cube;
    }

    /**
     * 
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
                    line += arr[r][c] + ", ";
                }
                console.log("\t" + line + "\n");
            }
            console.log("}");
        }
    }
}

// indexes in cubeData for each side of the cube, treating white as the bottom and blue as the front
// const colors = [Color.white, Color.blue, Color.orange, Color.green, Color.red, Color.yellow];
export enum Side {
    bottom = 0,
    front = 1,
    left = 2,
    back = 3,
    right = 4,
    top = 5
}