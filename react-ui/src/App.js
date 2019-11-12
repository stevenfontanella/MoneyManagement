import logo from './capital-one-logo2.png';
import './App.css';
//import tableData from './data.json';
import { VictoryStack, VictoryArea , VictoryLine, VictoryChart,VictoryLegend, VictoryAxis} from 'victory';

import React, { Component } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { MDBDataTable} from 'mdbreact';

const API = 'http://localhost:5000/transactions';


var total = 0;
var budget = 10000

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

function checkBudget(){
	budget = total + (total*0.1)
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
    this.state = {
      hits: [],
	  displays: [true,true,true,true,true,true,true,true,true],
	  startDate: new Date(),
	  endDate: new Date(),
	  isLoading: false
    };
  }
  componentDidMount() {
	const REAL_QUERY = '/get_date_range_9-15-2019_to_1-31-2020';
	const SINGLE_QUERY = '/get_month_9-2020';
	const VECTOR_QUERY = '/get_cats_255'
	const ALL_QUERY = '/'
	
	var QUERY = '/get_date_range_' + this.state.startDate.getMonth() +'-'+ this.state.startDate.getDate() +'-'+this.state.startDate.getFullYear() + '_to_' + this.state.endDate.getMonth() +'-'+ this.state.endDate.getDate() +'-'+ this.state.endDate.getFullYear();
	
	this.setState({ isLoading: true });
	var req = API + QUERY; 
    fetch(req)
      .then(response => response.json())
      .then(data => this.setState({ hits: data , isLoading: false }));
  }
   
  writeArea(cat,cond){
	if(cond){
	var rollingSum = sumCat(cat,this.state.hits);
	return (<VictoryArea
              data={rollingSum}
			  labels={({ data, index }) => index == data.length - 1 ? " " : ""}
            />)		
			}	
	}
	
  invert(){
	setInterval(this.invertHelp(),2000);
	
  }
  invertHelp(){
	//this.setState(displays[8] : this.state.displays[8]); 
	console.log("invert called " + this.state.displays[8])
	  
  }
  
  handleChangeS = date => {
    this.setState({
      startDate: date
    });
  };
  handleChangeE = date => {
    this.setState({
      endDate: date
    });
  };
	
  render() {
    var { hits, displays, isLoading } = this.state;
	var cats = ["Grocery","Merchandise","Other","Entertainment","Dining","Travel","Gas/Automotive","Insurance","Clothing"]
	
	
	if (isLoading) {
      return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Money Management
        </h1>
		<p>Loading Data....</p>
		  
		<div className="App-data-table">
        </div>
		
	  </header>	  
    
	</div>);
	}
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
		{checkBudget()}
		<p>{this.state.startDate.toString()}</p>
		<p>{this.state.endDate.toString()}</p>
		<input type="checkbox" id="OtherBox"  onChange={this.invert()}/> Other
		<VictoryChart height = {500} width = {1000} domainPadding={{x: 0, y: 100}}>
			<VictoryAxis 
			sytle={{
				
				  }} 
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
          <VictoryStack colorScale={["red","pink","green","purple","black","grey","yellow","tomato", "blue"]}>
			{this.writeArea("Grocery",displays[0])}
			{this.writeArea("Merchandise",displays[1])}
			{this.writeArea("Entertainment",displays[2])}
			{this.writeArea("Dining",displays[3])}
			{this.writeArea("Travel",displays[4])}
			{this.writeArea("Gas/Automotive",displays[5])}
			{this.writeArea("Insurance",displays[6])}
			{this.writeArea("Clothing",displays[7])}
			{this.writeArea("Other",displays[8])}			
          </VictoryStack>
		  <VictoryLine  data={[{ x: 0, y: total+(total*0.1)}, { x: 1000, y: total+(total*0.1) }, ]}/>
		< /VictoryChart>
		Start Date<DatePicker
			selected={this.state.startDate}
			onChange={this.handleChangeS}
		/>
		
		End Date <DatePicker
			selected={this.state.endDate}
			onChange={this.handleChangeE}
		/>
		<div className="App-data-table">
		<MDBDataTable striped bordered hover data={data}/>
        </div>
		
	  </header>	  
    
	</div>
	
    );
  
}
}

export default App;
