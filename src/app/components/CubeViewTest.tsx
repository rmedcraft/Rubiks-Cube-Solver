import { extend } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from "react";
import * as THREE from "three"
import { colors, CubeData } from "./CubeDataTest";
import { TileView } from "./TileViewTest";
import { RotationQueue } from "./RotationQueue";

// determines whether the rotation is clockwise, counterclockwise, or double
export enum Direction {
    regular,
    prime,
    double
}

// indexes in cubeDataRef.current for each side of the cube, treating white as the bottom and blue as the front
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


export interface CubeViewHandle {
    test: () => number,
    update: (delta: number) => void
}

interface CubeViewProps {
    paused: boolean,
    dim: number,
}

export const CubeView = forwardRef<CubeViewHandle, CubeViewProps>((props: any, ref) => {
    const { paused, dim } = props
    const pausedRef = useRef<boolean>(paused)

    useEffect(() => {
        pausedRef.current = paused
    }, [paused])


    const rotatingRef = useRef<boolean>(false)

    const currentRotationRef = useRef<Rotation | undefined>(undefined)

    const queueRef = useRef(new RotationQueue())
    const queue = queueRef.current

    const cubeRef = useRef<THREE.Group>(null)
    const cubeDataRef = useRef<CubeData>(new CubeData(dim))
    const cubeData = cubeDataRef.current


    function update(delta: number) {
        if (pausedRef.current) return


        if (!rotatingRef.current) {
            if (!currentRotationRef.current) {
                currentRotationRef.current = queue.dequeue()
                rotatingRef.current = true
                return
            }

            // update cubeData with the corresponding rotation once the rotation animation finishes
            cubeData.rotateBySide(currentRotationRef.current)

            // push the most recent rotation back into the queue, for testing rotations endlessly
            queue.push(currentRotationRef.current)

            // get the next thing in the list
            currentRotationRef.current = queue.dequeue()

            rotatingRef.current = true
        } else if (rotatingRef.current) {
            if (!currentRotationRef.current) {
                rotatingRef.current = false

                return
            }
            rotateBySide(delta)
        }
    }

    useImperativeHandle(ref, () => ({
        test: () => 3,
        update,
    }))


    useEffect(() => {
        if (!cubeRef.current) return
        // initialize cubeData to solved state & set up visualization
        for (let i = 0; i < 6; i++) {
            const cubeSide = cubeData.getSide(i as Side)
            for (let r = 0; r < cubeSide.length; r++) {
                for (let c = 0; c < cubeSide.length; c++) {
                    const tile = cubeSide[c][r].current
                    if (!tile) return

                    const tileObj = tile.getTile()

                    // rotate tile correctly
                    const side = i as Side;
                    tile.rotateBySide(side);

                    // position tile correctly
                    if (side === Side.front) {
                        tileObj.position.y = c;
                        tileObj.position.x = r;
                    }
                    if (side === Side.back) {
                        tileObj.position.y = c;
                        tileObj.position.x = r;
                        tileObj.position.z = -dim;
                    }

                    if (side === Side.left) {
                        tileObj.position.z = r;
                        tileObj.position.y = c;
                        // line up with the borders of the front and back
                        tileObj.position.z += 0.5 - dim;

                        tileObj.position.x -= 0.5;

                    }
                    if (side === Side.right) {
                        tileObj.position.z = r;
                        tileObj.position.y = c;
                        // line up with the borders of the front and back
                        tileObj.position.z += 0.5 - dim;

                        tileObj.position.x += dim - 0.5;
                    }

                    if (side === Side.top) {
                        tileObj.position.y += dim - 0.5;
                        tileObj.position.x = r;
                        tileObj.position.z = c; // have the physical rotations match what you expect to happen in the matrix

                        // line up with the borders of the front and back
                        tileObj.position.z += 0.5 - dim;
                    }
                    if (side === Side.bottom) {
                        tileObj.position.y -= 0.5;
                        tileObj.position.x = r;
                        tileObj.position.z = c;

                        // line up with the borders of the front and back
                        tileObj.position.z += 0.5 - dim;
                    }

                    // add to cube group
                    cubeRef.current!.add(tileObj);

                    // add to cubeData
                }
            }
        }

        // offset all children to be centered at (0, 0, 0) which allows for easier rotation
        const center = getCenterPoint()!
        cubeRef.current.children.forEach((child) => {
            child.position.sub(center)
        })


        // temporary adding to the queue for testing
        // const str = "F U F' U'"
        const str = "F L B U R D F' L' B' U' R' D' F2 L2 B2 U2 R2 D2"
        queue.pushStr(str)
    }, [])

    return (
        <group ref={cubeRef}>
            {Array.from({ length: 6 }).map((_, faceIndex) =>
                cubeData.getSide(faceIndex).map((row, rowIndex) =>
                    row.map((tileRef, colIndex) => (
                        <TileView
                            key={`${faceIndex}-${rowIndex}-${colIndex}`}
                            ref={tileRef}
                            color={colors.at(faceIndex)!}
                        />
                    ))
                )
            )}
        </group>
    )

    function rotateBySide(delta: number) {
        console.log("rotating")
        if (!currentRotationRef.current) return
        if (currentRotationRef.current.side === Side.front) {
            f(delta)
        }
        if (currentRotationRef.current.side === Side.back) {
            b(delta)
        }
        if (currentRotationRef.current.side === Side.left) {
            l(delta)
        }
        if (currentRotationRef.current.side === Side.right) {
            r(delta)
        }
        if (currentRotationRef.current.side === Side.top) {
            u(delta)
        }
        if (currentRotationRef.current.side === Side.bottom) {
            d(delta)
        }
    }



    function groupSide() {
        const side = currentRotationRef.current!.side
        const group = new THREE.Group()
        cubeData.getSide(side).flat().forEach(element => {
            group.add(element.current!.getTile())
        });
        return group
    }

    /**
     * Determine the correct amount to rotate during one clock tick
     * @param delta The change in time since the last clock tick
     * @returns Updated delta value after checking various parameters
     */
    function getDelta(delta: number) {
        const { direction } = currentRotationRef.current!

        let maxAngle = Math.PI / 2
        if (direction === Direction.double) {
            maxAngle = Math.PI

            // make rotation go twice as fast if doing a double turn
            delta *= 2
        }

        if (currentRotationRef.current!.amountRotated + delta >= maxAngle) {
            // stop rotating and snap to wherever the turn is supposed to bring you
            rotatingRef.current = false
            delta = maxAngle - currentRotationRef.current!.amountRotated
        }
        currentRotationRef.current!.amountRotated += delta

        if (direction === Direction.prime) {
            delta *= -1
        }
        return delta
    }

    // for ungrouping the rotated side of the cube once rotated. 
    function ungroupSide(group: THREE.Group) {
        while (group.children.length > 0) {
            const element = group.children[0]
            // update the world matrix based on the transformations made within the group
            element.updateMatrixWorld(true)
            element.matrix.copy(element.matrixWorld)
            element.matrix.decompose(element.position, element.quaternion, element.scale)
            element.matrixAutoUpdate = true

            // group.remove(element)
            cubeRef.current!.add(element)
        }
    }

    function f(delta: number) {
        if (currentRotationRef.current!.side !== Side.front) return

        const group = groupSide()

        for (let i = 0; i < dim; i++) {
            group.add(cubeData.getSide(Side.top)[dim - 1][i].current!.getTile())
            group.add(cubeData.getSide(Side.bottom)[dim - 1][i].current!.getTile())
            group.add(cubeData.getSide(Side.right)[i][dim - 1].current!.getTile())
            group.add(cubeData.getSide(Side.left)[i][dim - 1].current!.getTile())
        }

        delta = getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -delta)
        group.updateMatrixWorld(true)

        ungroupSide(group)
    }

    function b(delta: number) {
        if (currentRotationRef.current!.side !== Side.back) return
        const group = groupSide()

        for (let i = 0; i < dim; i++) {
            group.add(cubeData.getSide(Side.top)[0][i].current!.getTile())
            group.add(cubeData.getSide(Side.bottom)[0][i].current!.getTile())
            group.add(cubeData.getSide(Side.right)[i][0].current!.getTile())
            group.add(cubeData.getSide(Side.left)[i][0].current!.getTile())
        }

        delta = getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), delta)
        group.updateMatrixWorld(true)

        ungroupSide(group)
    }

    function l(delta: number) {
        if (currentRotationRef.current!.side !== Side.left) return

        const group = groupSide()

        for (let i = 0; i < dim; i++) {
            group.add(cubeData.getSide(Side.top)[i][0].current!.getTile())
            group.add(cubeData.getSide(Side.bottom)[i][0].current!.getTile())
            group.add(cubeData.getSide(Side.front)[i][0].current!.getTile())
            group.add(cubeData.getSide(Side.back)[i][0].current!.getTile())
        }

        delta = getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), delta)
        group.updateMatrixWorld(true)

        ungroupSide(group)
    }

    function r(delta: number) {
        if (currentRotationRef.current!.side !== Side.right) return

        const group = groupSide()

        for (let i = 0; i < dim; i++) {
            group.add(cubeData.getSide(Side.top)[i][dim - 1].current!.getTile())
            group.add(cubeData.getSide(Side.bottom)[i][dim - 1].current!.getTile())
            group.add(cubeData.getSide(Side.front)[i][dim - 1].current!.getTile())
            group.add(cubeData.getSide(Side.back)[i][dim - 1].current!.getTile())
        }

        delta = getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -delta)
        group.updateMatrixWorld(true)

        ungroupSide(group)
    }

    function u(delta: number) {
        if (currentRotationRef.current!.side !== Side.top) return

        const group = groupSide()

        for (let i = 0; i < dim; i++) {
            group.add(cubeData.getSide(Side.left)[dim - 1][i].current!.getTile())
            group.add(cubeData.getSide(Side.right)[dim - 1][i].current!.getTile())
            group.add(cubeData.getSide(Side.front)[dim - 1][i].current!.getTile())
            group.add(cubeData.getSide(Side.back)[dim - 1][i].current!.getTile())
        }

        delta = getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -delta)
        group.updateMatrixWorld(true)

        ungroupSide(group)
    }

    function d(delta: number) {
        if (currentRotationRef.current!.side !== Side.bottom) return

        const group = groupSide()

        for (let i = 0; i < dim; i++) {
            group.add(cubeData.getSide(Side.left)[0][i].current!.getTile())
            group.add(cubeData.getSide(Side.right)[0][i].current!.getTile())
            group.add(cubeData.getSide(Side.front)[0][i].current!.getTile())
            group.add(cubeData.getSide(Side.back)[0][i].current!.getTile())
        }

        delta = getDelta(delta)

        group.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta)
        group.updateMatrixWorld(true)

        ungroupSide(group)
    }


    function getCenterPoint() {
        if (!cubeRef.current) return

        let middle = new THREE.Vector3();

        let geometry = new THREE.Box3();
        geometry.setFromObject(cubeRef.current);

        middle.x = (geometry.max.x + geometry.min.x) / 2;
        middle.y = (geometry.max.y + geometry.min.y) / 2;
        middle.z = (geometry.max.z + geometry.min.z) / 2;

        cubeRef.current.localToWorld(middle);
        return middle;
    }
})