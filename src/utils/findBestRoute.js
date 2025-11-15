export function buildGraph(stoptimes, stops) {
  const graph = {};

  // Build graph along trips
  stoptimes.forEach(({ trip_id, stop_id, stop_sequence }) => {
    if (!graph[stop_id]) graph[stop_id] = new Set();

    const nextStop = stoptimes.find(
      (s) => s.trip_id === trip_id && s.stop_sequence === stop_sequence + 1
    );
    if (nextStop) {
      graph[stop_id].add(nextStop.stop_id);
      if (!graph[nextStop.stop_id]) graph[nextStop.stop_id] = new Set();
      graph[nextStop.stop_id].add(stop_id);
    }
  });

  // Add transfer connections for shared parent_station
  const parentGroups = {};
  stops.forEach((stop) => {
    const parent = stop.parent_station || stop.stop_id;
    if (!parentGroups[parent]) parentGroups[parent] = [];
    parentGroups[parent].push(stop.stop_id);
  });

  Object.values(parentGroups).forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i];
        const b = group[j];
        graph[a]?.add(b);
        graph[b]?.add(a);
      }
    }
  });

  return graph;
}

// Stop → Route mapping (e.g. stop_id belongs to Line 1)
export function mapStopsToRoutes(stoptimes, trips, routes) {
  const tripToRoute = {};
  trips.forEach((t) => (tripToRoute[t.trip_id] = t.route_id));

  const stopToRoutes = {};
  stoptimes.forEach((s) => {
    const routeId = tripToRoute[s.trip_id];
    if (!stopToRoutes[s.stop_id]) stopToRoutes[s.stop_id] = new Set();
    stopToRoutes[s.stop_id].add(routeId);
  });

  // Convert route IDs to readable names
  const routeName = {};
  routes.forEach((r) => (routeName[r.route_id] = r.route_long_name));

  const stopRouteMap = {};
  Object.entries(stopToRoutes).forEach(([stop, routeIds]) => {
    stopRouteMap[stop] = Array.from(routeIds).map((r) => routeName[r]);
  });

  return stopRouteMap;
}

export function bfsShortestPath(graph, start, goal) {
  const queue = [[start]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === goal) return path;
    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = graph[node] || [];
      for (const neighbor of neighbors) {
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }

  return null;
}
