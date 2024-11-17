const parseMatrix = (input) =>
    input
        .trim()
        .split("\n") // Split rows by newlines
        .map((row) => row.trim().split(/\s+/).map(Number)); // Split columns by spaces or multiple spaces

const formatMatrix = (matrix) => {
    return matrix.map((row) => row.join(" ")).join("\n");
};

const parseVectors = (input) =>
    input
        .trim()
        .split("\n")
        .map((vector) => vector.split(",").map(Number));

const determinant = (matrix) => {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Determinant can only be calculated for square matrices.");
    }

    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (matrix.length === 3) {
        return (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );
    }

    throw new Error("Only 2x2 and 3x3 matrices are supported for determinant.");
};


const transpose = (matrix) => {
    const transposed = matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
    return formatMatrix(transposed);
};


const rref = (matrix) => {
    const m = matrix.map((row) => [...row]);
    let lead = 0;
    const rowCount = m.length;
    const colCount = m[0].length;

    for (let r = 0; r < rowCount; r++) {
        if (lead >= colCount) return m;
        let i = r;
        while (m[i][lead] === 0) {
            i++;
            if (i === rowCount) {
                i = r;
                lead++;
                if (lead === colCount) return m;
            }
        }
        [m[i], m[r]] = [m[r], m[i]];
        const lv = m[r][lead];
        m[r] = m[r].map((val) => val / lv);
        for (let i = 0; i < rowCount; i++) {
            if (i !== r) {
                const lv = m[i][lead];
                m[i] = m[i].map((val, colIndex) => val - lv * m[r][colIndex]);
            }
        }
        lead++;
    }
    return m;
};
// Calculate rank of a matrix
const rank = (matrix) => {
    const rref = (m) => {
        const mat = [...m.map((row) => [...row])];
        let lead = 0;
        for (let r = 0; r < mat.length; r++) {
            if (lead >= mat[0].length) return mat;
            let i = r;
            while (mat[i][lead] === 0) {
                i++;
                if (i === mat.length) {
                    i = r;
                    lead++;
                    if (lead === mat[0].length) return mat;
                }
            }
            [mat[i], mat[r]] = [mat[r], mat[i]];
            const lv = mat[r][lead];
            mat[r] = mat[r].map((val) => val / lv);
            for (let i = 0; i < mat.length; i++) {
                if (i !== r) {
                    const lv = mat[i][lead];
                    mat[i] = mat[i].map((val, col) => val - lv * mat[r][col]);
                }
            }
            lead++;
        }
        return mat;
    };
    const rrefMatrix = rref(matrix);
    return rrefMatrix.filter((row) => row.some((val) => val !== 0)).length;
};

// Calculate inverse of a matrix
const inverse = (matrix) => {
    const size = matrix.length;
    if (size !== matrix[0].length) throw new Error("Matrix must be square for inverse.");
    const augmented = matrix.map((row, i) =>
        [...row, ...Array(size).fill(0).map((_, j) => (i === j ? 1 : 0))]
    );
    const rrefMatrix = rref(augmented);
    const inverseMatrix = rrefMatrix.map((row) => row.slice(size));
    return inverseMatrix;
};

// Calculate dot product of two vectors
const dotProduct = (vector1, vector2) => {
    if (vector1.length !== vector2.length) throw new Error("Vectors must be of the same length.");
    return vector1.reduce((sum, val, idx) => sum + val * vector2[idx], 0);
};

// Calculate cross product of two 3D vectors
const crossProduct = (vector1, vector2) => {
    if (vector1.length !== 3 || vector2.length !== 3)
        throw new Error("Cross product is defined for 3D vectors only.");
    return [
        vector1[1] * vector2[2] - vector1[2] * vector2[1],
        vector1[2] * vector2[0] - vector1[0] * vector2[2],
        vector1[0] * vector2[1] - vector1[1] * vector2[0],
    ];
};

// Placeholder eigenvalues calculation (symbolic libraries are better for this)


document.getElementById("calculate-btn").addEventListener("click", () => {
    const operation = document.getElementById("operation").value;
    const input = document.getElementById("input").value;
    const solutionDiv = document.getElementById("solution");

    try {
        let result;
        const matrix = parseMatrix(input);

        switch (operation) {
            case "determinant":
                result = `Determinant: ${determinant(matrix)}`;
                break;
            case "transpose":
                result = `Transpose:\n${transpose(matrix)}`;
                break;
            case "rref":
                result = `RREF:\n${formatMatrix(rref(matrix))}`;
                break;
            case "rank":
                result = `Rank: ${rank(matrix)}`;
                break;
            case "inverse":
                result = `Inverse:\n${formatMatrix(inverse(matrix))}`;
                break;
            case "dotProduct":
                const vector1 = parseMatrix(prompt("Enter the first vector (space-separated):"));
                const vector2 = parseMatrix(prompt("Enter the second vector (space-separated):"));
                result = `Dot Product: ${dotProduct(vector1[0], vector2[0])}`;
                break;
            case "crossProduct":
                const vec1 = parseMatrix(prompt("Enter the first 3D vector (space-separated):"));
                const vec2 = parseMatrix(prompt("Enter the second 3D vector (space-separated):"));
                result = `Cross Product: ${crossProduct(vec1[0], vec2[0]).join(" ")}`;
                break;
            default:
                throw new Error("Operation not implemented yet!");
        }

        solutionDiv.innerText = result;
    } catch (error) {
        solutionDiv.innerText = `Error: ${error.message}`;
    }
});
