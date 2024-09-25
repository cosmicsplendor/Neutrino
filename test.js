const instanceMat = {
  "0": 2,
  "1": 0,
  "2": 0,
  "3": 0,
  "4": 2,
  "5": 0,
  "6": -1,
  "7": -1,
  "8": 1
}
  
  const vertices = [
    0, 0,
    1, 0,
    0, 1,
    1, 0,
    1, 1,
    0, 1
  ];
  
  function multiplyMatrixVector(mat, vec) {
    return [
      mat[0] * vec[0] + mat[3] * vec[1] + mat[6],
      mat[1] * vec[0] + mat[4] * vec[1] + mat[7],
    ];
  }
  
  const transformedVertices = [];
  
  for (let i = 0; i < vertices.length; i += 2) {
    const vertex = [vertices[i], vertices[i + 1]];
    const transformedVertex = multiplyMatrixVector(instanceMat, vertex);
    transformedVertices.push(...transformedVertex);
  }
  
  console.log(transformedVertices);