import React from 'react';
import logo from './logo.svg';
import './App.css';
import tableData from './data.json';
import { VictoryBar } from 'victory';
import { JsonToTable } from "react-json-to-table";

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Capital One Money Management
        </h1>
        <p>
          HELLO WORLD
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <VictoryBar
          data={data}
          // data accessor for x values
          x="quarter"
          // data accessor for y values
          y="earnings"
        />
        <JsonToTable json={tableData} />
      </header>
    </div>
  );
}

export default App;
