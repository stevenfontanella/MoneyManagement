import logo from './capital-one-logo2.png';
import './App.css';
//import tableData from './data.json';
import { VictoryStack, VictoryArea } from 'victory';
//import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';
import { JsonToTable } from "react-json-to-table";
import React, { Component } from 'react';
//import tableData from './data.json';

import { MDBDataTable } from 'mdbreact';

const API = 'http://localhost:5000/transactions';
const DEFAULT_QUERY = '/';
const budget = 35000
var total = 0;
var display = true

function sumCat(cat,arr){
	var sum = 0;
	var rollingSum = [];
	var temp = {x: 0, y:0}
	for(var i in arr){
		if(cat == "all"){
			sum = arr[i].amount + sum;
			temp = { x : i, y: sum}
			total = sum;
			rollingSum.push(temp);
		}else{
			if(cat == arr[i].category){
				sum = arr[i].amount + sum;
				temp = { x : i, y: sum};
				rollingSum.push(temp);	
			}else{
				temp = { x : i, y: sum};
				rollingSum.push(temp);			
			}
		}		
	}	
	return rollingSum;
}

function checkBudget(){
	if (total >= budget){
		return(
        <div className="App-warning-bar">
          <p>WARNING: OVER MONTHLY LIMIT</p>
        </div>)
    }else if ((budget-total) <= (budget*0.1)){
		return(
			<div className="App-caution-bar">
				<p>CAUTION: CLOSE TO MONTHLY LIMIT</p>
			</div>)	
	}
	
	
}

class App extends Component {
  constructor(props) {
    super(props);
	this.displays = [true,true,true,true,true,true,true,true,true]
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
   
  writeArea(cat,cond){
	if(cond){
	var rollingSum = sumCat(cat,this.state.hits);
	
	return (<VictoryArea
              data={rollingSum}
			  labels={({ data, index }) => index == data.length - 1 ? cat : ""}
            />)		
			}	
	}
	invert(){
		var checkBox = document.getElementById("OtherBox");
		if (checkBox.checked == true){
			this.displays[8] = true;
		} else {
			this.displays[8] = false;
		}
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
	var data = {
		columns: [
      {
        label: 'Amount',
        field: 'amount',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Category',
        field: 'category',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Date',
        field: 'date',
        sort: 'asc',
        width: 250
      },
      {
        label: 'ID',
        field: 'id',
        sort: 'asc',
        width: 75
      },
      {
        label: 'User',
        field: 'user',
        sort: 'asc',
        width: 50
      },
      {
        label: 'Location',
        field: 'vendorLocation',
        sort: 'asc',
        width: 300
      },
	  {
        label: 'Vendor',
        field: 'vendorName',
        sort: 'asc',
        width: 300
      }
    ],
  rows: hits
  };
	return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Money Management
        </h1>
		<p>{total} {this.displays[8]}</p>
		{checkBudget()}
		<input type="checkbox" id="OtherBox"  onchange="this.invert()"/> Other 
		
		<div className="App-data-table">
          <VictoryStack colorScale={["red","gold","green","purple","black","grey","yellow","tomato", "blue", "orange"]}>
            {this.writeArea("Grocery",true)}
			{this.writeArea("Merchandise",true)}
			{this.writeArea("Entertainment",true)}
			{this.writeArea("Dining",true)}
			{this.writeArea("Travel",true)}
			{this.writeArea("Gas/Automotive",true)}
			{this.writeArea("Insurance",true)}
			{this.writeArea("Clothing",true)}
			{this.writeArea("Other",this.displays[8])}			
          </VictoryStack>
        </div>
		<MDBDataTable striped bordered hover data={data}/>
	  </header>	  
    
	</div>
	
    );
  
}
}

export default App;
