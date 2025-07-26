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
        return this.rotationMap.get(str.trim())
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
}