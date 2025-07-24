import * as THREE from 'three';
import { Color, TileView } from './TileView';
import { rotateMatrix180, rotateMatrixClockwise, rotateMatrixCounterClockwise } from '../utils/matrixUtils';
import { colors, CubeData } from './CubeData';

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
// storing the amount rotated so the animation knows when to stop 
export type Rotation = {
    direction: Direction,
    side: Side
    amountRotated: number
}

export class CubeView {
    private dim: number;
    // private cubeData: Color[][][] = [];
    private cubeData: CubeData
    private cube: THREE.Group = new THREE.Group();

    // used internally for keeping track of the current rotation and when the cube is being rotated
    private rotating: boolean = true
    private currentRotation: Rotation = {
        direction: Direction.regular,
        side: Side.left,
        amountRotated: 0
    }
    private i = 0

    constructor(dim: number) {
        this.dim = Math.round(dim);

        this.cubeData = new CubeData(dim)

        // initialize cubeData to solved state & set up visualization
        for (let i = 0; i < 6; i++) {
            const cubeSide = this.cubeData.getSide(i as Side)
            for (let r = 0; r < cubeSide.length; r++) {
                for (let c = 0; c < cubeSide.length; c++) {
                    const tile = cubeSide[c][r]

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
                }
            }
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
        // rotationList here temporarily for testing
        const rotationList = [
            {
                direction: Direction.regular,
                side: Side.left,
                amountRotated: 0
            },

            {
                direction: Direction.regular,
                side: Side.top,
                amountRotated: 0
            },

            {
                direction: Direction.prime,
                side: Side.left,
                amountRotated: 0
            },

            {
                direction: Direction.prime,
                side: Side.top,
                amountRotated: 0
            },
            // {
            //     direction: Direction.regular,
            //     side: Side.right,
            //     amountRotated: 0
            // },

            // {
            //     direction: Direction.regular,
            //     side: Side.bottom,
            //     amountRotated: 0
            // },

            // {
            //     direction: Direction.prime,
            //     side: Side.right,
            //     amountRotated: 0
            // },

            // {
            //     direction: Direction.prime,
            //     side: Side.bottom,
            //     amountRotated: 0
            // },
            // {
            //     direction: Direction.regular,
            //     side: Side.front,
            //     amountRotated: 0
            // },

            // {
            //     direction: Direction.regular,
            //     side: Side.bottom,
            //     amountRotated: 0
            // },

            // {
            //     direction: Direction.prime,
            //     side: Side.front,
            //     amountRotated: 0
            // },

            // {
            //     direction: Direction.prime,
            //     side: Side.bottom,
            //     amountRotated: 0
            // },
            // {
            //     direction: Direction.regular,
            //     side: Side.back,
            //     amountRotated: 0
            // },
            // {
            //     direction: Direction.regular,
            //     side: Side.top,
            //     amountRotated: 0
            // },
            // {
            //     direction: Direction.prime,
            //     side: Side.back,
            //     amountRotated: 0
            // },
            // {
            //     direction: Direction.prime,
            //     side: Side.top,
            //     amountRotated: 0
            // },
        ]
        if (!this.rotating) {
            // update cubeData with the corresponding rotation once the rotation animation finishes
            this.cubeData.rotateBySide(this.currentRotation)

            this.i = (this.i + 1) % rotationList.length
            this.currentRotation = rotationList[this.i]


            this.rotating = true
        } else if (this.rotating) {
            this.rotateBySide(delta)
        }
    }

    getCube() {
        return this.cube;
    }

    rotateBySide(delta: number) {
        if (this.currentRotation.side === Side.front) {
            this.f(delta)
        }
        if (this.currentRotation.side === Side.back) {
            this.b(delta)
        }
        if (this.currentRotation.side === Side.left) {
            this.l(delta)
        }
        if (this.currentRotation.side === Side.right) {
            this.r(delta)
        }
        if (this.currentRotation.side === Side.top) {
            this.u(delta)
        }
        if (this.currentRotation.side === Side.bottom) {
            this.d(delta)
        }
    }

    private groupSide() {
        const side = this.currentRotation.side
        const group = new THREE.Group()
        this.cubeData.getSide(side).flat().forEach(element => {
            // this.cube.remove(element.mesh)
            group.add(element.mesh)
        });
        return group
    }

    /**
     * Determine the correct amount to rotate during one clock tick
     * @param delta The change in time since the last clock tick
     * @returns Updated delta value after checking various parameters
     */
    private getDelta(delta: number) {
        const { direction } = this.currentRotation

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

        if (direction === Direction.prime) {
            delta *= -1
        }
        return delta
    }

    // for ungrouping the rotated side of the cube once rotated. 
    private ungroupSide(group: THREE.Group) {
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
    }

    f(delta: number) {
        if (this.currentRotation.side !== Side.front) return

        const group = this.groupSide()

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData.getSide(Side.top)[this.dim - 1][i].mesh)
            group.add(this.cubeData.getSide(Side.bottom)[this.dim - 1][i].mesh)
            group.add(this.cubeData.getSide(Side.right)[i][this.dim - 1].mesh)
            group.add(this.cubeData.getSide(Side.left)[i][this.dim - 1].mesh)
        }

        delta = this.getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -delta)
        group.updateMatrixWorld(true)

        this.ungroupSide(group)
    }

    b(delta: number) {
        if (this.currentRotation.side !== Side.back) return
        const group = this.groupSide()

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData.getSide(Side.top)[0][i].mesh)
            group.add(this.cubeData.getSide(Side.bottom)[0][i].mesh)
            group.add(this.cubeData.getSide(Side.right)[i][0].mesh)
            group.add(this.cubeData.getSide(Side.left)[i][0].mesh)
        }

        delta = this.getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), delta)
        group.updateMatrixWorld(true)

        this.ungroupSide(group)
    }

    l(delta: number) {
        if (this.currentRotation.side !== Side.left) return

        const group = this.groupSide()

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData.getSide(Side.top)[i][0].mesh)
            group.add(this.cubeData.getSide(Side.bottom)[i][0].mesh)
            group.add(this.cubeData.getSide(Side.front)[i][0].mesh)
            group.add(this.cubeData.getSide(Side.back)[i][0].mesh)
        }

        delta = this.getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), delta)
        group.updateMatrixWorld(true)

        this.ungroupSide(group)
    }

    r(delta: number) {
        if (this.currentRotation.side !== Side.right) return

        const group = this.groupSide()

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData.getSide(Side.top)[i][this.dim - 1].mesh)
            group.add(this.cubeData.getSide(Side.bottom)[i][this.dim - 1].mesh)
            group.add(this.cubeData.getSide(Side.front)[i][this.dim - 1].mesh)
            group.add(this.cubeData.getSide(Side.back)[i][this.dim - 1].mesh)
        }

        delta = this.getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -delta)
        group.updateMatrixWorld(true)

        this.ungroupSide(group)
    }

    u(delta: number) {
        if (this.currentRotation.side !== Side.top) return

        const group = this.groupSide()

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData.getSide(Side.left)[this.dim - 1][i].mesh)
            group.add(this.cubeData.getSide(Side.right)[this.dim - 1][i].mesh)
            group.add(this.cubeData.getSide(Side.front)[this.dim - 1][i].mesh)
            group.add(this.cubeData.getSide(Side.back)[this.dim - 1][i].mesh)
        }

        delta = this.getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -delta)
        group.updateMatrixWorld(true)

        this.ungroupSide(group)
    }

    d(delta: number) {
        if (this.currentRotation.side !== Side.bottom) return

        const group = this.groupSide()

        for (let i = 0; i < this.dim; i++) {
            group.add(this.cubeData.getSide(Side.left)[0][i].mesh)
            group.add(this.cubeData.getSide(Side.right)[0][i].mesh)
            group.add(this.cubeData.getSide(Side.front)[0][i].mesh)
            group.add(this.cubeData.getSide(Side.back)[0][i].mesh)
        }

        delta = this.getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta)
        group.updateMatrixWorld(true)

        this.ungroupSide(group)
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

    printCube() {
        this.cubeData.printCube()
    }
}

