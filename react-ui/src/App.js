import logo from './capital-one-logo2.png';


import './App.css';
//import tableData from './data.json';
import { VictoryStack, VictoryArea , VictoryLine, VictoryChart,VictoryLegend, VictoryAxis} from 'victory';

import React, { Component } from 'react';
import {MDBDataTable,MDBInput, MDBBtn, MDBIcon, MDBBtnFixed, MDBBtnFixedItem } from "mdbreact";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";




const API = 'http://localhost:5000/transactions';


var total = 0;
var budget = 0;

function sumCat(cat,arr){
	var sum = 0;
	var rollingSum = [];
	var temp = {x: 0, y:0}
	for(var i in arr){
		if(cat == "all"){
			sum = arr[i].amount + sum;
			temp = { x : arr[i].date, y: sum}
			total = sum;
			rollingSum.push(temp);
		}else{
			if(cat == arr[i].category){
				sum = arr[i].amount + sum;
				temp = { x : arr[i].date, y: sum};
				rollingSum.push(temp);	
			}else{
				temp = { x : arr[i].date, y: sum};
				rollingSum.push(temp);			
			}
		}		
	}	
	return rollingSum;
}

function checkBudget(obj){
	budget = obj.helpers.budget
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
function updateGraph(obj){
	 obj.setState({ isLoading: true });
	 
	 var catVector = obj.generateCatVector();
	 
	 var QUERY = '/get_cats_'+ catVector +'_from_' + (obj.helpers.startDate.getMonth() + 1) +'-'+ obj.helpers.startDate.getDate() +'-'+obj.helpers.startDate.getFullYear() + '_to_' + (obj.helpers.endDate.getMonth()+1) +'-'+ obj.helpers.endDate.getDate() +'-'+ obj.helpers.endDate.getFullYear();
	 var req = API + QUERY; 
	 fetch(req)
      .then(response => response.json())
      .then(data => obj.setState({ hits: data, isLoading: false}));	  
  }
function setMonth(obj,num){
	//obj.helpers.endDate = new Date();
	obj.helpers.startDate = new Date(obj.helpers.endDate.getTime());
	obj.helpers.startDate.setMonth(obj.helpers.startDate.getMonth() - num);
	console.log(obj.helpers.startDate)
	updateGraph(obj)	
}
function getBudget(obj){
	var QUERY = '/get_prediction_for_' + (obj.helpers.endDate.getMonth() + 1)+'-'+ obj.helpers.endDate.getFullYear();  
	var req = API + QUERY;
	fetch(req).then(response => response.json()).then(data => obj.helpers.budget = parseInt(data))
	
  }
  
function invert(obj,index){
	obj.helpers.displays[index]=!obj.helpers.displays[index]
  }
  
class App extends Component {
  constructor(props) {
    super(props);
	this.helpers = {
		displays: [true,true,true,true,true,true,true,true,true],
		budget: 0,
		startDate: new Date(),
		endDate: new Date()};
    this.state = {
      hits: [],
	  isLoading: false
    };
  }
  
  componentDidMount() {
	const REAL_QUERY = '/get_date_range_9-15-2019_to_1-31-2020';
	
	this.setState({ isLoading: true });
	var req = API + REAL_QUERY; 
    fetch(req)
      .then(response => response.json())
      .then(data => this.setState({ hits: data , isLoading: false }));
  }
  

  
   
  writeArea(cat){
	var rollingSum = sumCat(cat,this.state.hits);
	return (<VictoryArea
              data={rollingSum}
			  labels={({ data, index }) => index == data.length - 1 ? " " : ""}
            />)		
				
	}
	
  
  
  
  handleChangeS = date => {
    this.helpers.startDate = date;
  };
  
  handleChangeE = date => {
    this.helpers.endDate = date;
  };
  generateCatVector(){
	var catVector = 0;
	for(var i=0;i<this.helpers.displays.length;i++){
		if(this.helpers.displays[i]){
			catVector+= Math.pow(2,i);
		}	
	}
	return catVector;
  }
  render() {
	getBudget(this)
    var { hits, isLoading } = this.state;
	var {displays, budget} = this.helpers;
	
	var cats = ["Grocery","Merchandise","Other","Entertainment","Dining","Travel","Gas/Automotive","Insurance","Clothing"]
	
	
	if (isLoading) {
	return ( <div className="App">
	
	  
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Money Management
        </h1>
		{checkBudget(this)}
		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline1"  defaultChecked={this.helpers.displays[8]} onChange={() => {invert(this,8)}}/>
			<label class="custom-control-label" for="defaultInline1">Grocery</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline2" defaultChecked={this.helpers.displays[7]} onChange={() => {invert(this,7)}}/>
			<label class="custom-control-label" for="defaultInline2">Merchandise</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline3" defaultChecked={this.helpers.displays[6]} onChange={() => {invert(this,6)}}/>
			<label class="custom-control-label" for="defaultInline3">Other</label>
		</div>
		
		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline4"  defaultChecked={this.helpers.displays[5]} onChange={() => {invert(this,5)}}/>
			<label class="custom-control-label" for="defaultInline4">Entertainment</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline5" defaultChecked={this.helpers.displays[4]} onChange={() => {invert(this,4)}}/>
			<label class="custom-control-label" for="defaultInline5">Dining</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline6" defaultChecked={this.helpers.displays[3]} onChange={() => {invert(this,3)}}/>
			<label class="custom-control-label" for="defaultInline6">Travel</label>
		</div>
		
		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline7"  defaultChecked={this.helpers.displays[2]} onChange={() => {invert(this,2)}}/>
			<label class="custom-control-label" for="defaultInline7">Gas/Automotive</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline8" defaultChecked={this.helpers.displays[1]} onChange={() => {invert(this,1)}}/>
			<label class="custom-control-label" for="defaultInline8">Insurance</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline9" defaultChecked={this.helpers.displays[0]} onChange={() => {invert(this,0)}}/>
			<label class="custom-control-label" for="defaultInline9">Clothing</label>
		</div>
		<div className="App-Date-Boxes">
		<div className="App-Date-Boxes">
		    Start Date<DatePicker
			    selected={this.helpers.startDate}
			    onChange={this.handleChangeS}
		/>
		</div>
		
		<div className="App-Date-Boxes">
		    End Date <DatePicker
			  selected={this.helpers.endDate}
			  onChange={this.handleChangeE}
		     />
		</div>
		</div>
		 
		<MDBBtn color="primary" onClick = {() => {updateGraph(this)}} >Apply Dates</MDBBtn>
		
		Loading...
		
	  </header>	  
    
	</div>
	
    );}
	
	for (var i in hits) {
        hits[i].user = "temp";
		hits[i].date = hits[i].date.replace("00:00:00 GMT","");		
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
    //  {
    //    label: 'ID',
    //    field: 'id',
    //    sort: 'asc',
    //    width: 75
    //  },
     // {
     //   label: 'User',
     //   field: 'user',
     //   sort: 'asc',
     //   width: 50
     // },
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
		{checkBudget(this)}
		</header>
		<div className="App-CheckBoxes">
		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline1"  defaultChecked={this.helpers.displays[8]} onChange={() => {invert(this,8)}}/>
			<label class="custom-control-label" for="defaultInline1">Grocery</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline2" defaultChecked={this.helpers.displays[7]} onChange={() => {invert(this,7)}}/>
			<label class="custom-control-label" for="defaultInline2">Merchandise</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline3" defaultChecked={this.helpers.displays[6]} onChange={() => {invert(this,6)}}/>
			<label class="custom-control-label" for="defaultInline3">Other</label>
		</div>
		
		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline4"  defaultChecked={this.helpers.displays[5]} onChange={() => {invert(this,5)}}/>
			<label class="custom-control-label" for="defaultInline4">Entertainment</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline5" defaultChecked={this.helpers.displays[4]} onChange={() => {invert(this,4)}}/>
			<label class="custom-control-label" for="defaultInline5">Dining</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline6" defaultChecked={this.helpers.displays[3]} onChange={() => {invert(this,3)}}/>
			<label class="custom-control-label" for="defaultInline6">Travel</label>
		</div>
		
		<div class="custom-control custom-checkbox custom-control-inline">
			<input type="checkbox" class="custom-control-input" id="defaultInline7"  defaultChecked={this.helpers.displays[2]} onChange={() => {invert(this,2)}}/>
			<label class="custom-control-label" for="defaultInline7">Gas/Automotive</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input  type="checkbox" class="custom-control-input" id="defaultInline8" defaultChecked={this.helpers.displays[1]} onChange={() => {invert(this,1)}}/>
			<label class="custom-control-label" for="defaultInline8">Insurance</label>
		</div>


		<div class="custom-control custom-checkbox custom-control-inline">
			<input size = "lg" type="checkbox" class="custom-control-input" id="defaultInline9" defaultChecked={this.helpers.displays[0]} onChange={() => {invert(this,0)}}/>
			<label class="custom-control-label" for="defaultInline9">Clothing</label>
		</div>
		</div>
		
		
		<div className="App-Date-Boxes">
		<div className="App-Date-Boxes">
		    Start Date <DatePicker
			    selected={this.helpers.startDate}
			    onChange={this.handleChangeS}
		/>
		</div>
		
		<div className="App-Date-Boxes">
		    End Date <DatePicker
			  selected={this.helpers.endDate}
			  onChange={this.handleChangeE}
		     />
		</div>
		</div>
		
		<MDBBtn color="primary" onClick = {() => {updateGraph(this)}} >Apply Filters</MDBBtn>
		<div>
		<MDBBtn color="primary" onClick = {() => {setMonth(this,1)}} >One Month</MDBBtn>
		<MDBBtn color="primary" onClick = {() => {setMonth(this,3)}} >Three Months</MDBBtn>
		<MDBBtn color="primary" onClick = {() => {setMonth(this,6)}} >Six Months</MDBBtn>
		</div>
		<VictoryChart style = {{parent: {border: "10px solid #ccc"}}} height = {500} width = {1000} domainPadding={{x: 0, y: 100}}>
			<VictoryAxis  
			fixLabelOverlap={true}/>
			<VictoryAxis sytle={{grid:{stroke:"grey"}}} dependentAxis/>
			<VictoryLegend x={100} y={175}
				itemsPerRow={2}
				orientation="horizontal"
				gutter={20}
				style={{ border: { stroke: "black" }, title: {fontSize: 10 } }}
				data={[
					{ name: "Grocery", symbol: { fill: "red" } },
					{ name: "Merchandise", symbol: { fill: "pink" } },
					{ name: "Entertainment", symbol: { fill: "green" } },
					{ name: "Dining", symbol: { fill: "purple" } },
					{ name: "Travel", symbol: { fill: "black" } },
					{ name: "Gas/Automotive", symbol: { fill: "grey" } },
					{ name: "Insurance", symbol: { fill: "yellow" } },
					{ name: "Clothing", symbol: { fill: "tomato" } },
					{ name: "Other", symbol: { fill: "blue" } }
				]}
			/>
          <VictoryStack height = {250} width = {500} colorScale={["red","pink","green","purple","black","grey","yellow","tomato", "blue"]}>
			{this.writeArea("Grocery")}
			{this.writeArea("Merchandise")}
			{this.writeArea("Entertainment")}
			{this.writeArea("Dining")}
			{this.writeArea("Travel")}
			{this.writeArea("Gas/Automotive")}
			{this.writeArea("Insurance")}
			{this.writeArea("Clothing")}
			{this.writeArea("Other")}			
          </VictoryStack>
		  <VictoryLine  data={[{ x: 0, y: budget}, { x: 1000, y: budget }, ]}/>
		< /VictoryChart>
		
		<div className="App-data-table">
			<MDBDataTable striped bordered hover data={data}/>
        </div>
		
	    
    
	</div>
	
    );
  
}
}

export default App;
