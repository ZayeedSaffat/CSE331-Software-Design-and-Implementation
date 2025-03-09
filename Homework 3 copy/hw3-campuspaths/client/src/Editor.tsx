import React, { MouseEvent, ChangeEvent, Component } from 'react';
import { Building } from './buildings';


type EditorProps = {
  /** Names of all the buildings that are available to choose. */
  buildings: Array<Building>;

  /** Called to note that the selection has changed. */
  onEndPointChange: (endPoints?: [Building, Building]) => void;
};

type EditorState = {
  // TODO: decide on the state to store
  fromBuilding: string;
  toBuilding: string;
  buildingOptions: JSX.Element[];
};


/** Component that allows the user to edit a marker. */
export class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    let buildingsList: JSX.Element[] = [];
    let i = 0;
    for (const building of this.props.buildings) {
      //console.log(building);
  
      //if building is a valid string, then add
      buildingsList.push(<option key={i} value={building.longName}>{building.longName}</option>);
      i += 1;
    }

    this.state = {fromBuilding: "", toBuilding: "", buildingOptions: buildingsList};
  }

  render = (): JSX.Element => {
    // TODO: fill this in
    //console.log(this.props.buildings);
    //console.log(this.state.buildingOptions);
    return <div>

      <p>
        From:
        <select id="dropdown" value={this.state.fromBuilding} onChange={this.doFromBuildingChange}>
          <option value="">(chose a buildling)</option>
          {this.state.buildingOptions}
        </select>
      </p>

      <p>
        To:
        <select id="dropdown" value={this.state.toBuilding} onChange={this.doToBuildingChange}>
          <option value="">(chose a buildling)</option>
          {this.state.buildingOptions}
        </select>
      </p>

      <p>
        <button type="button" onClick={this.doClearClick}>Clear</button>
      </p>

    </div>;
  };

  doFromBuildingChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({fromBuilding: evt.target.value});

    if ( this.state.toBuilding !== "" && evt.target.value !== "" ) { //if both buildlings set
      //console.log("fromBuilding set");
      this.props.onEndPointChange( [this.doNameToBuildingChange(evt.target.value), this.doNameToBuildingChange(this.state.toBuilding)] );
    } 
    else { //optional?
      this.props.onEndPointChange(undefined);
    }
  };

  doToBuildingChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({toBuilding: evt.target.value});

    if ( this.state.fromBuilding !== "" && evt.target.value !== "" ) {
      //console.log("toBuilding set");
      this.props.onEndPointChange( [this.doNameToBuildingChange(this.state.fromBuilding), this.doNameToBuildingChange(evt.target.value)] );
    } 
    else { //optional?
      this.props.onEndPointChange(undefined);
    }
  };

  doClearClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    //this.props.onCancelClick();
    this.setState({fromBuilding: "", toBuilding: ""});

    //console.log("clear");
    this.props.onEndPointChange(undefined); //reset endponits
  };

  //doNameToBuildingClick = (building: string): Building => {
  doNameToBuildingChange = (building: string): Building => {
    for (const currBuilding of this.props.buildings) {
      if (currBuilding.longName === building) {
        return currBuilding;
      }
    }
    console.log("Building error");
    return {shortName: "", longName: "", location: {x:0, y:0}}; //place holder return, should not be reached
  }

}

//buildings not showing up, not properly inserted into this.state.buildlings
//i thought the buildings in props.buildings were string names, but they were records w/ longName: string

//what to do since there is sometimes "chose a building"

//status 400 for fetching shortestPath, but not for buildings