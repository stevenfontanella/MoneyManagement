import logo from './capital-one-logo2.png';


import './App.css';
import { VictoryStack,VictoryPie, VictoryArea , VictoryLine, VictoryChart,VictoryLegend, VictoryAxis} from 'victory';

import React, { Component } from 'react';
import {MDBDataTable,MDBInput, MDBBtn, MDBIcon, MDBBtnFixed, MDBBtnFixedItem } from "mdbreact";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";




const API = 'http://localhost:5000/transactions';


var total = 0;

function sumCat(obj,cat,arr){
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
	var now = new Date();
	if(obj.helpers.showBudget && arr.length != 0 && now <= obj.helpers.endDate){
		
		obj.helpers.endDate = new Date(arr[arr.length-1].date);
		
		while(obj.helpers.startDate.getMonth() == obj.helpers.endDate.getMonth()){	
		temp = { x : obj.helpers.endDate.toDateString(), y: 0};
		rollingSum.push(temp);
		obj.helpers.endDate.setDate(obj.helpers.endDate.getDate()+1)		
		}
	}
	return rollingSum;
}

function checkBudget(obj){
	if(obj.helpers.showBudget){
	var budget = obj.helpers.budget
	console.log("in check" + budget)
	var now = new Date();
	var finalDay = new Date(obj.helpers.startDate.getFullYear(),obj.helpers.startDate.getMonth()+1,0);
	var totalDays = finalDay.getDate()
	
	if (total >= budget){
		return(
		
        <div className="App-warning-bar">
          <p>WARNING: OVER MONTHLY LIMIT <br></br> Spent ${(total-budget).toFixed(2)} more than your predicted budget of ${budget.toFixed(2)}</p>
        </div>
		
		)
		
    }else if (total/budget > now.getDate()/totalDays && now < obj.helpers.endDate && now > obj.helpers.startDate){
		return(
			<div className="App-caution-bar">
				<p>CAUTION: On Track to Exceed Budget <br></br>Your budget this month is ${budget.toFixed(2)}, and current spending is ${total.toFixed(2)}</p>
			</div>)	
	}
	return(
		<div className="App-green-Bar">
			<p>Currently Projected to be Under Budget this month :) <br></br>Your budget this month is ${budget.toFixed(2)}, and current spending is ${total.toFixed(2)}</p>
		</div>
	)
	}
	return(
		<div className="App-status-Bar">
			<p>Spending for this period was ${total.toFixed(2)}</p>
		</div>)
	
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
	obj.helpers.showBudget = false;
	updateGraph(obj)	
}
function getBudget(obj){
	var QUERY = '/get_prediction_for_' + (obj.helpers.startDate.getMonth() + 1)+'-'+ obj.helpers.startDate.getFullYear();  
	var req = API + QUERY;
	obj.setState({ budgetLoading: true });
	fetch(req).then(response => response.json()).then(data => obj.helpers.budget = parseInt(data)).then(() => obj.setState({ budgetLoading: false }))
	
	
  }
function writeBudget(obj){
	if(obj.helpers.showBudget){
		return (<VictoryLine  data={[{ x: 0, y: obj.helpers.budget}, { x: 10000, y: obj.helpers.budget }, ]}/>)
	}
}

function thisMonth(obj){
	var startDate = new Date();
	obj.helpers.displays = [true,true,true,true,true,true,true,true,true];
	startDate.setDate(1);
	var endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,0);
	
	obj.helpers.startDate = startDate;
	obj.helpers.endDate = endDate;
	obj.helpers.showBudget = true;
	
	getBudget(obj)
	//obj.helpers.budget = 500;	
	updateGraph(obj);
}
function budgetGivenMonth(obj){
	var startDate = new Date(obj.helpers.endDate.getFullYear(),obj.helpers.endDate.getMonth(),1);
	obj.helpers.displays = [true,true,true,true,true,true,true,true,true];
	var endDate = new Date(startDate.getFullYear(),startDate.getMonth()+1,0);
	
	getBudget(obj)
	//obj.helpers.budget = 500;
	console.log(startDate)
	console.log(endDate)
	obj.helpers.startDate = startDate;
	obj.helpers.endDate = endDate;
	obj.helpers.showBudget = true;
	updateGraph(obj); 
	 
	 
 }
function invert(obj,index){
	obj.helpers.displays[index]=!obj.helpers.displays[index]
  }
function applyFilters(obj){
	obj.helpers.showBudget = false;
	updateGraph(obj)
	
}
class App extends Component {
  constructor(props) {
    super(props);
	this.helpers = {
		displays: [true,true,true,true,true,true,true,true,true],
		budget: 0,
		catSums: [],
		showBudget: true,
		startDate: new Date(),
		endDate: new Date()};
		
    this.state = {
      hits: [],
	  isLoading: false,
	  budgetLoading:false
    };
  }
  
  componentDidMount() {
	thisMonth(this);
	
  }
  

  
   
  writeArea(cat){
	var rollingSum = sumCat(this,cat,this.state.hits);
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
	
    var { hits, isLoading, budgetLoading } = this.state;
	var {displays, budget ,catSums} = this.helpers;
	
	var cats = ["Grocery","Merchandise","Other","Entertainment","Dining","Travel","Gas/Automotive","Insurance","Clothing"]
	
	
	if (isLoading || budgetLoading) {
	return ( <div className="App-Loading">
	
	  
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Money Management
        </h1>
						
		Loading...
		
	  </header>	  
    
	</div>
	
    );}
	
	for (var i in hits) {
        hits[i].user = "temp";
		hits[i].date = hits[i].date.replace("00:00:00 GMT","");	
     }
	var tableData = hits;
	for (var i in tableData) {
		try{
		hits[i].amount = Math.round(hits[i].amount*100)/100;
		}
		catch(error){
		console.log(hits[i].amount)			
		}
     }
	var rollingSumAll = sumCat(this,"all",hits);
	var data = {
		columns: [
      {
        label: 'Amount ($)',
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
		rows: tableData
	};
	
	
	
	return (
     
	  <div className="App">
	   
	  
		
      <header className="App-header">
      
		<div className="App-title">
			<img src={logo} className="App-logo" alt="logo" />
			<h1 style={{fontSize:"2.5em"}}>
				Money Management
			</h1>
		</div>
		
		{checkBudget(this)}
		<div className="App-spacer"> </div>
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
		</div>
		<br></br>
		<div className="App-CheckBoxes">
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
		<br></br>
		
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
		
		<MDBBtn color="primary" onClick = {() => {applyFilters(this)}} >Apply Filters</MDBBtn>
		<div>
		<MDBBtn color="indigo" onClick = {() => {setMonth(this,1)}} >One Month</MDBBtn>
		<MDBBtn color="red" onClick = {() => {setMonth(this,3)}} >Three Months</MDBBtn>
		<MDBBtn color="blue" onClick = {() => {setMonth(this,6)}} >Six Months</MDBBtn>
		</div>
		<MDBBtn color="primary" onClick = {() => {thisMonth(this)}} >This Month w/Prediction</MDBBtn>
		<MDBBtn color="primary" onClick = {() => {budgetGivenMonth(this)}} >Past Month w/Prediction*</MDBBtn>
		<p>*Month is Selected Using End Date</p>
		<VictoryChart style = {{parent: {border: "10px solid #ccc"}}} height = {500} width = {1500} domainPadding={{x: 0, y: 100}}>
			<VictoryAxis  
			fixLabelOverlap={true}/>
			<VictoryAxis sytle={{grid:{stroke:"grey"}}} dependentAxis/>
			
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
		  {writeBudget(this)}
		  <VictoryLegend x={65} y={175}
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
		< /VictoryChart>
		
		
		
		
		<div className="App-data-table">
			<MDBDataTable striped bordered hover data={data}/>
        </div>
		
	    
    
	</div>
	
    );
  
}
}

export default App;