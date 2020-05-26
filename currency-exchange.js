function buildRatesGraph (rates) {
  const graph = new Map()

  // If there are no rates, return an empty graph
  if (!rates || rates.length === 0) {
    return graph
  }

  // For each rate entry
  for (const [sourceCurrency, targetCurrency, rate] of rates) {
    // If the source currency is not yet in the graph, add it to the graph with no neighbours
    if (!graph.has(sourceCurrency)) {
      graph.set(sourceCurrency, [])
    }

    // If the target currency is not yet in the graph, add it to the graph with no neighbours
    if (!graph.has(targetCurrency)) {
      graph.set(targetCurrency, [])
    }

    // Add the target currency to source currency neighbours with weight rate
    graph.get(sourceCurrency).push([targetCurrency, rate])
    // Add the source currency to target  currency neighbours with weight 1 / rate
    graph.get(targetCurrency).push([sourceCurrency, 1 / rate])
  }

  return graph
}

function findPath (graph, origin, destination, visited = new Set(), path = []) {
  // If the origin matches the destination, return the path including the destination
  if (origin === destination) {
    return [...path, destination]
  }

  // Mark the origin as visited and append it to the path
  visited.add(origin)
  path.push(origin)

  const neighbours = graph.get(origin) || []

  for (const [neighbour] of neighbours) {
    // If the neighbour has already been visited, skip it
    if (visited.has(neighbour)) {
      continue
    }

    // Find the path from the neighbour to the destination
    const foundPath = findPath(graph, neighbour, destination, visited, path)

    // If the path is not empty, return it
    if (foundPath.length) {
      return foundPath
    }
  }

  // Since no path was found until now, pop the last path element and return an empty path
  path.pop()
  return []
}

function exchangeCurrencies (rates, sourceCurrency, targetCurrency, sourceValue = 1) {
  // If the source and target currencies match, there's no need for conversion
  if (sourceCurrency === targetCurrency) {
    return sourceValue
  }

  // Build the graph representation
  const graph = buildRatesGraph(rates)

  // If the graph is empty, return null
  if (!graph.size) {
    return null
  }

  // Find the path
  const path = findPath(graph, sourceCurrency, targetCurrency)

  // If the path is empty, return null
  if (!path.length) {
    return null
  }

  // Target value starts as source value
  let targetValue = sourceValue

  // For each two consecutive path entries
  for (let i = 0; i < path.length - 1; i++) {
    // Find the rate between those entries
    const rate = graph.get(path[i]).find(conversions => conversions[0] === path[i + 1])[1]
    // And apply it to the target value
    targetValue *= rate
  }

  // Return target value
  return targetValue
}

module.exports = exchangeCurrencies
