import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { BUILDINGS, EDGES, Location } from './campus';

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

/** Returns a list of all known buildings. */
export const getBuildings = (_req: SafeRequest, res: SafeResponse): void => {
  res.json({buildings: BUILDINGS});
};


// TODO (Task 1 - Retrieve You Me): add a route to get the shortest path
import { shortestPath } from './dijkstra';  // Import shortestPath function
  
const buildingNameToLocation = (buildingName: string): Location => {
  for (const building of BUILDINGS) {
    if (building.longName === buildingName) {
      return building.location;
    }
  }
  return BUILDINGS[0].location;
}

/**
 * Function to retrieve the shortest path from start to end building
 */
export const getShortestPath = (req: SafeRequest, res: SafeResponse): void => {
  // Extract the start and end buildings from the query parameters
  const startName = req.query.start;
  const endName = req.query.end;

  if (typeof startName !== 'string' || typeof endName !== 'string') {
    res.status(400).send('Start and end buildings are not strings.');
    return;
  }

  const startLocation = buildingNameToLocation(startName);
  const endLocation = buildingNameToLocation(endName);
  if (!startLocation || !endLocation) {
    res.status(400).send('Buildings not found.');
    return;
  }
  
  // Call the shortestPath function from dijkstra.ts
  const path = shortestPath(startLocation, endLocation, EDGES); // Assuming edges are accessible this way

  //console.log(path);

  if (path) {
    res.json(path); // Return the path to the client
  } else {
    res.status(404).send('No path found between the buildings.');
  }
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give multiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};