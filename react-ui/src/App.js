import React from 'react';
import logo from './capital-one-logo2.png';
import './App.css';
import tableData from './data.json';
import { VictoryStack, VictoryArea } from 'victory';
import { JsonToTable } from "react-json-to-table";

function App() {
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
          <VictoryStack>
            <VictoryArea
              data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}]}
            />
            <VictoryArea
              data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}]}
            />
            <VictoryArea
              data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
            />
          </VictoryStack>
        </div>
        <JsonToTable json={tableData} />
      </header>
    </div>
  );
}

export default App;
