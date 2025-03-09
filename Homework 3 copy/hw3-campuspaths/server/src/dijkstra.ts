import { Location, Edge } from './campus';
import { Comparator, Heap, newHeap } from './heap';


/**
 * A path from one location on the map to another by following along the given
 * steps in the order they appear in the array. Each edge must start at the
 * place where the previous edge ended. We also cache the total distance of the
 * edges in the path for faster access.
 */
export type Path =
    {start: Location, end: Location, steps: Array<Edge>, dist: number};

//Edge
//start: Location;
//end: Location;
//dist: number;

//Location
//x: number
//y: number

/**
 * Returns the shortest path from the given start to the given ending location
 * that can be made by following along the given edges. If no path exists, then
 * this will return undefined. (Note that all distances must be positive or else
 * shortestPath may not work!)
 */
export const shortestPath = (
    _start: Location, _end: Location, edges: Array<Edge>): Path | undefined => { //changed _edges to edges

  // TODO (Task 1 - The Full-Short Press): implement this

  //console.log(edges);
  // A map from an (x,y) location to the list of all edges that start at that location. These give us all the locations you can get to from that location in one step.
  const adjacent: Map<String, Edge[]> = new Map();

  for (const e of edges) {
    const startLocation: string = locationToString(e.start);

    let edgeArray: Array<Edge> = [];
    if (!adjacent.has(startLocation)) {
      edgeArray.push(e);
    } 
    else {
      edgeArray = (adjacent.get(startLocation) ?? []).concat(e);
    }

    adjacent.set( startLocation, edgeArray );
  }
  //console.log(adjacent);

  // A set of (x,y) locations for which we have already found the shortest path. The algorithm will avoid considering new paths to these locations
  const finished: Set<Location> = new Set();

  const pathComparator: Comparator<Path> = (a: Path, b: Path) => a.dist - b.dist;
  // A (priority) queue containing all paths to locations that are one step from a finished node. The key idea of the algorithm is that the shortest path in the
  // queue to a non-finished node must be the shortest path to that node.
  const active: Heap<Path> = newHeap<Path>(pathComparator);

  //BEGIN ALGORITHm
  const firstPath = {start: _start, end: _start, steps: [], dist: 0};
  active.add(firstPath);
  //active.add({start: _start, end: _start, steps: [], dist: 0});

  // Inv:
  while (!active.isEmpty()) {
    const minPath = active.removeMin();

    //console.log("NEWNEWNEWNEWENWENWEW");
    //console.log(printFinished(finished));
    //console.log(printPath(minPath));
    
    //if (minPath.end === _end) {
    if (minPath.end.x === _end.x && minPath.end.y === _end.y) {
      //console.log(1);
      return minPath;
    }

    //let a = 1;
    if (finished.has(minPath.end)) {
      //a++;
      //console.log(a);
      continue;
    }

    //console.log(a);

    finished.add(minPath.end);

    for ( const e of adjacent.get(locationToString(minPath.end)) ?? [] ) {
      //console.log(5);
      if (!finished.has(e.end)) {
        const newPath = {start: minPath.start, end: e.end, steps: minPath.steps.concat(e), dist: minPath.dist + e.dist};
        //console.log(6);
        active.add(newPath);
      }
    }
  }

  // If we exhaust all possible paths without finding the destination, return undefined
  return undefined;
};

const locationToString = (location: Location): string => {
  return location.x + " " + location.y;
}