/**
 * Dijkstra's algorithm for multi-modal public transport graph
 * Supports route line names and transfer detection
 */

export function findShortestPath(graph, startId, endId) {
  const distances = {};
  const previous = {};
  const queue = new Set(Object.keys(graph.nodes));

  // initialize distances
  for (const id of queue) distances[id] = Infinity;
  distances[startId] = 0;

  while (queue.size > 0) {
    // find node with min distance
    const current = [...queue].reduce((min, node) =>
      distances[node] < distances[min] ? node : min
    );

    queue.delete(current);

    if (current === endId || distances[current] === Infinity) break;

    for (const edge of graph.edges[current] || []) {
      const alt = distances[current] + (edge.weight || 1);
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        previous[edge.to] = { id: current, edge };
      }
    }
  }

  // reconstruct path
  const path = [];
  let current = endId;
  while (current && previous[current]) {
    path.unshift({
      from: previous[current].id,
      to: current,
      ...previous[current].edge,
    });
    current = previous[current].id;
  }

  if (path.length === 0) return null; // no route found

  // summarize lines & transfers
  const summary = [];
  let currentLine = path[0].line_name;
  let mode = path[0].mode;
  let stops = 1;

  for (let i = 1; i < path.length; i++) {
    const step = path[i];
    if (step.mode === "transfer" || step.line_name !== currentLine) {
      summary.push({
        line: currentLine,
        mode,
        stops,
        transfer: step.mode === "transfer",
      });
      currentLine = step.line_name;
      mode = step.mode;
      stops = 1;
    } else {
      stops++;
    }
  }
  summary.push({ line: currentLine, mode, stops, transfer: false });

  return { path, summary };
}
