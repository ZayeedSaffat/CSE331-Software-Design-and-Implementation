import React, { Component } from 'react';
import { Building, Edge, parseBuildings, parseLocation } from './buildings';
import { Editor } from './Editor';
import campusMap from './img/campus_map.jpg';
import { isRecord } from './record';


// Radius of the circles drawn for each marker.
const RADIUS: number = 30;


type AppProps = {};  // no props

type AppState = {
  buildings?: Array<Building>;       // list of known buildings
  endPoints?: [Building, Building];  // end for path
  path?: Array<Edge>;                // shortest path between end points
};
 

/** Top-level component that displays the entire UI. */
export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount = (): void => {
    const p = fetch('/api/buildings');
    p.then(this.doBuildingsResp)
    p.catch((ex) => this.doBuildingsError('failed to connect', ex));
  }

  render = (): JSX.Element => {
    if (!this.state.buildings) {
      return <p>Loading building information...</p>;
    } else {
      return <div>
          <svg id="svg" width="866" height="593" viewBox="0 0 4330 2964">
            <image href={campusMap} width="4330" height="2964"/>
            {this.renderPath()}
            {this.renderEndPoints()}
          </svg>
          <Editor buildings={this.state.buildings}
              onEndPointChange={this.doEndPointChange}/>
        </div>;
    }
  };

  /** Returns SVG elements for the two end points. */
  renderEndPoints = (): Array<JSX.Element> => {
    if (!this.state.endPoints) {
      return [];
    } else {
      const [start, end] = this.state.endPoints;
      return [
          <circle cx={start.location.x} cy={start.location.y} fill={'red'} r={RADIUS}
              stroke={'white'} strokeWidth={10} key={'start'}/>,
          <circle cx={end.location.x} cy={end.location.y} fill={'blue'} r={RADIUS}
              stroke={'white'} strokeWidth={10} key={'end'}/>
        ];
    }
  };

  /** Returns SVG elements for the edges on the path. */
  renderPath = (): Array<JSX.Element> => {
    if (!this.state.path) {
      return [];
    } else {
      const elems: Array<JSX.Element> = [];
      for (const [i, e] of this.state.path.entries()) {
        elems.push(<line x1={e.start.x} y1={e.start.y} key={i}
            x2={e.end.x} y2={e.end.y} stroke={'fuchsia'} strokeWidth={20}/>)
      }
      return elems;
    }
  };

  // Called with the response object from the /api/buildings request
  doBuildingsResp = (res: Response): void => {
    //console.log(res);
    if (res.status === 200) {
      const p = res.json();
      p.then(this.doBuildingsJson);
      p.catch((ex) => this.doBuildingsError('200 response is not JSON', ex));
    } else if (res.status === 400) {
      const p = res.text();
      p.then(this.doBuildingsError);
      p.catch((ex) => this.doBuildingsError('400 response is not text', ex));
    } else {
      this.doBuildingsError(`bad status code: ${res.status}`);
    }
  };

  // Called with the JSON data from the server (200 response).
  doBuildingsJson = (data: unknown): void => {
    if (!isRecord(data))
      throw new Error(`data is not a record: ${typeof data}`);

    const buildings = parseBuildings(data.buildings);
    this.setState({buildings});
  };

  // Called with the error message from the server (400 response).
  doBuildingsError = (msg: string, ex?: unknown): void => {
    console.error(`fetch of /api/buildings failed: ${msg}`)
    if (ex instanceof Error)
      throw ex;
  };

  doEndPointChange = (endPoints?: [Building, Building]): void => {
    this.setState({endPoints, path: undefined});
    if (endPoints) {
      const [start, end] = endPoints;
      console.log(`show path from ${start.shortName} to ${end.shortName}`);
      // TODO (Task 1 - Retrieve You Me): fetch the shortest path and parse the response

      // Fetch the shortest path from the server
      const url = `/api/shortestPath?start=${encodeURIComponent(start.longName)}&end=${encodeURIComponent(end.longName)}`;
      //const url = `/api/shortestPath?start=${start.longName}&end=${end.longName}`;
      //const url = '/api/shortestPath';
      const p: Promise<Response> = fetch(url);

      p.then(this.doPathResp);
      p.catch((ex) => this.doPathError('failed to connect', ex));
    } 
    else {
      console.log('show no path');
    }
  };

  doPathResp = (res: Response): void => {
    if (res.status === 200) {
      //console.log("200");

      const p = res.json();
      //console.log("PPP" + p);
      p.then(this.doPathJson);
      p.catch((ex) => this.doPathError('200 response is not JSON', ex));
    } 
    else if (res.status === 400) {
      //console.log("400");

      const p = res.text();
      //console.log("PPP" + p);
      p.then(this.doPathError);
      p.catch((ex) => this.doPathError('400 response is not text', ex));
    } 
    else {
      //console.log("AFGFAFAFA");
      this.doPathError(`bad status code: ${res.status}`);
    }
  }

  // Called with the JSON data from the server (200 response).
  doPathJson = (data: unknown): void => {
    if (!isRecord(data))
      throw new Error(`data is not a record: ${typeof data}`);

    console.log(data);
    const path = this.doParsePathChange(data);
    this.setState({path});
  };

  // Called with the error message from the server (400 response).
  doPathError = (msg: string, ex?: unknown): void => {
    console.error(`fetch of /api/buildings failed: ${msg}`)
    if (ex instanceof Error)
      throw ex;
  };

  
  //Parses JSON data containing an array of buildings.
  //parsePath = (data: unknown): Array<Edge> => {
  doParsePathChange = (data: unknown): Array<Edge> => {
    const path: Array<Edge> = [];
    if (!isRecord(data)) {
      throw new Error(`data not a record: ${typeof data}`);
    }

    if (!Array.isArray(data.steps)) {
      throw new Error(`steps not a array: ${typeof data.steps}`);
    }

    for (const e of data.steps) {
      if (!isRecord(e))
        throw new Error(`edge not a record: ${typeof e}`)

      if (!isRecord(e.start))
        throw new Error(`edge start not a record: ${e.start}`);
      
      if (!isRecord(e.end))
        throw new Error(`edge end not a record: ${e.end}`);
    
      const currEdge: Edge = {
          start: parseLocation(e.start),
          end: parseLocation(e.end)
        };

      path.push(currEdge);
    }

    return path;
  };
  

  
}
