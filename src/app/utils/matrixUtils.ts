/**
 * rotates a matrix 90 degrees clockwise. adapted from https://stackoverflow.com/questions/42519/how-do-you-rotate-a-two-dimensional-array#8664879
 * @param matrix the matrix to be rotated 
 * @returns the rotated matrix
 */
export function rotateMatrixClockwise(matrix: any[][]) {
    // find layers of the matrix
    const size = matrix.length
    const layers = Math.floor(size / 2)

    for (let i = 0; i < layers; i++) {
        const firstIndex = i
        const lastIndex = size - i - 1

        for (let j = firstIndex; j < lastIndex; j++) {
            const offset = j - firstIndex

            const top = matrix[firstIndex][j]
            const right = matrix[j][lastIndex]
            const bottom = matrix[lastIndex][lastIndex - offset]
            const left = matrix[lastIndex - offset][firstIndex]

            // left -> top
            matrix[firstIndex][j] = left
            // top -> right
            matrix[j][lastIndex] = top
            // right -> bottom
            matrix[lastIndex][lastIndex - offset] = right
            // bottom -> left
            matrix[lastIndex - offset][firstIndex] = bottom
        }
    }
    return matrix
}

export function rotateMatrixCounterClockwise(matrix: any[][]) {
    // find layers of the matrix
    const size = matrix.length
    const layers = Math.floor(size / 2)

    for (let i = 0; i < layers; i++) {
        const firstIndex = i
        const lastIndex = size - i - 1

        for (let j = firstIndex; j < lastIndex; j++) {
            const offset = j - firstIndex

            const top = matrix[firstIndex][j]
            const right = matrix[j][lastIndex]
            const bottom = matrix[lastIndex][lastIndex - offset]
            const left = matrix[lastIndex - offset][firstIndex]

            // right -> top
            matrix[firstIndex][j] = right
            // top -> left
            matrix[lastIndex - offset][firstIndex] = top
            // left -> bottom
            matrix[lastIndex][lastIndex - offset] = left
            // bottom -> right
            matrix[j][lastIndex] = bottom
        }
    }
    return matrix
}

export function rotateMatrix180(matrix: any[][]) {
    rotateMatrixClockwise(matrix)
    rotateMatrixClockwise(matrix)
    return matrix
}