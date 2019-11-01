import logo from './capital-one-logo2.png';
import './App.css';
//import tableData from './data.json';
import { VictoryStack, VictoryArea } from 'victory';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';
import { JsonToTable } from "react-json-to-table";
import React, { Component } from 'react';
import tableData from './data.json';

const API = 'http://localhost:5000/transactions';
const DEFAULT_QUERY = '/';

function sumCat(cat,arr){
	var sum = 0;
	var rollingSum = [];
	for(var i in arr){
		if(cat == "all"){
			sum = arr[i].amount + sum;
			var temp = { x : i, y: sum}
			rollingSum.push(temp)
		}else{
			if(cat == arr[i].category){
				sum = arr[i].amount + sum;
				var temp = { x : i, y: sum}
				rollingSum.push(temp)	
			}else{
			var temp = { x : i, y: sum}
			rollingSum.push(temp)			
			}
		}		
	}	
	return rollingSum;
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
	  isLoading: false
    };
  }
  componentDidMount() {
	this.setState({ isLoading: true });
	var req = API + DEFAULT_QUERY; 
    fetch(req)
      .then(response => response.json())
      .then(data => this.setState({ hits: data , isLoading: false }));
  }
   
  
  render() {
    var { hits, isLoading } = this.state;
	var cats = ["Grocery","Merchandise","Other","Entertainment","Dining","Travel","Gas/Automotive","Insurance","Clothing"]
	
	
	if (isLoading) {
      return <p>Loading...</p>;
	}
	for (var i in hits) {
        hits[i].user = "temp";
     }
	 
	var rollingSumAll = sumCat("all",hits);
	var rollingSumGroc = sumCat("Grocery",hits);
	var rollingSumMerc = sumCat("Merchandise",hits);
	var rollingSumOther = sumCat("Other",hits);
	var rollingSumEnt = sumCat("Entertainment",hits);
	var rollingSumDine = sumCat("Dining",hits);
	var rollingSumTrav = sumCat("Travel",hits);
	var rollingSumAuto = sumCat("Gas/Automotive",hits);
	var rollingSumInsu = sumCat("Insurance",hits);
	var rollingSumCloth = sumCat("Clothing",hits);
	 
	 
	return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Money Management
        </h1>
        <div className="App-status-bar">
          <p>CAUTION: Near Monthly Limit</p>
        </div>
        <div className="App-data-table">
          <VictoryStack colorScale={["red","blue","green","purple","black","grey","yellow","tomato", "orange", "gold"]}>
            <VictoryArea
              data={rollingSumAll}
            />
            <VictoryArea
              data={rollingSumGroc}
            />
            <VictoryArea
              data={rollingSumMerc}
            />
			<VictoryArea
              data={rollingSumOther}
            />
			<VictoryArea
              data={rollingSumEnt}
            />
			<VictoryArea
              data={rollingSumDine}
            />
			<VictoryArea
              data={rollingSumTrav}
            />
			<VictoryArea
              data={rollingSumAuto}
            />
			<VictoryArea
              data={rollingSumInsu}
            />
			<VictoryArea
              data={rollingSumCloth}
            />
          </VictoryStack>
        </div>
        <JsonToTable json = {hits} />
      </header>
    </div>
    );
  
}
}

export default App;
