import express, { Express } from "express";
import bodyParser from 'body-parser';
import { readFileSync } from 'fs';
import { parseEdges } from "./campus";
import { getBuildings } from "./routes";
import { getShortestPath } from "./routes";


// Parse the information about the walkways on campus.
const content: string = readFileSync("data/campus_edges.csv", {encoding: 'utf-8'});
parseEdges(content.split("\n"));


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/buildings", getBuildings);
// TODO (Task 1 - Retrieve You Me): add a route to get the shortest path
// Add the new route to get the shortest path
app.get("/api/shortestPath", getShortestPath); // Handle shortest path request

app.listen(port, () => console.log(`Server listening on ${port}`));

//DOONDEONDOENDEONODENODEN