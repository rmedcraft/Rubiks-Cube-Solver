import { Direction, Rotation, Side } from "./CubeView"

export class RotationQueue {
    queue: Rotation[] = []
    strToSide: Map<string, Side> = new Map()
    rotationMap: Map<string, Rotation> = new Map()

    constructor() {
        // setup strToSide map
        this.strToSide.set("U", Side.top)
        this.strToSide.set("D", Side.bottom)
        this.strToSide.set("L", Side.left)
        this.strToSide.set("R", Side.right)
        this.strToSide.set("F", Side.front)
        this.strToSide.set("B", Side.back)

        // setup str to rotation
        const rotationTypes = ["U", "D", "L", "R", "F", "B"]
        rotationTypes.forEach((type) => {

            const side = this.strToSide.get(type)
            if (side === undefined) return
            this.rotationMap.set(type, {
                direction: Direction.regular,
                side,
                amountRotated: 0
            })
            this.rotationMap.set(type + "'", {
                direction: Direction.prime,
                side,
                amountRotated: 0
            })
            this.rotationMap.set(type + "2", {
                direction: Direction.double,
                side,
                amountRotated: 0
            })
        })
    }

    dequeue(): Rotation | undefined {
        const result = this.queue.at(0)

        if (this.queue.length > 0) {
            this.queue.splice(0, 1)
        }

        return result
    }

    push(...rotations: Rotation[]) {
        rotations.forEach((rotation) => {
            if (rotation) {
                rotation.amountRotated = 0
                this.queue.push(rotation)
            }
        })
    }

    pushStr(str: string) {
        str = str.toUpperCase()
        const rotations = this.strsToRotations(...str.split(" "))
        if (rotations) {
            this.push(...rotations)
        }
    }

    print() {
        console.log(this.queue)
    }

    strToRotation(str: string): Rotation | undefined {
        return structuredClone(this.rotationMap.get(str.trim()))
    }

    strsToRotations(...strs: string[]): Rotation[] | undefined {
        const rotationList: Rotation[] = []
        strs.forEach((str) => {
            const rotation = this.strToRotation(str)
            if (rotation) {
                rotationList.push(rotation)
            }
        })
        return rotationList
    }

    /**
     * 
     * @param depth the number of random rotations to make, defaults to 20. If the depth is a decimal, it rounds up to the nearest integer
     * @returns a randomized array of rotations that scramble the cube
     */
    generateScramble(depth: number = 20): string[] {
        // maps each rotation to its opposite
        const rotToOpposite = new Map<string, string>([["F", "B"], ["B", 'F'], ["U", "D"], ["D", "U"], ["L", "R"], ["R", "L"]])


        // stores all available rotations on the cube
        const allRotations: string[] = Array.from(this.rotationMap.keys())

        // stores the current rotations that can be chosen
        let currentRotations: string[] = allRotations

        const scrambleList: string[] = []

        console.log("Starting Values:")
        console.log("allRotations:", allRotations)
        console.log("currentRotations:", currentRotations)
        console.log("scrambleList:", scrambleList)

        for (let i = 0; i < depth; i++) {
            // generate random rotation from currentRotations
            const currentRot = currentRotations[Math.floor(Math.random() * currentRotations.length)]
            console.log("Current Rotation:", currentRot)
            scrambleList.push(currentRot)
            console.log("scrambleList:", scrambleList)

            // removes anything on the same or opposite side from currentRotations
            currentRotations = allRotations.filter((rotation) => rotation[0] !== currentRot[0] && rotation[0] !== rotToOpposite.get(currentRot[0]))
            console.log("currentRotations:", currentRotations)
        }

        return scrambleList
    }
}