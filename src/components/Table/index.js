import React, {Component} from "react";
import Button from "../Button";
import "./index.css";

const largeColumn = {
  width: "60%",
  overflow: "hidden"
};

const midColumn = {
  width: "20%",
  paddingLeft: "15px"
};

const smallColumn = {
  width: "10%"
};

function Table(props) {
    const {list, onDismiss} = props;
    return(
      <div>
        <div className="table-label">
          <span style={largeColumn}>Article</span>
          <span style={smallColumn}>Author</span>
          <span style={smallColumn}>Comments</span>
          <span style={smallColumn}>Points</span>
        </div>
        <div className="table">
        {list.map(item => (
            <div key={item.objectID} className="table-row">
              <span style={largeColumn}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={smallColumn}>{item.author}</span>
              <span style={smallColumn}>{item.num_comments}</span>
              <span style={smallColumn}>{item.points}</span>
              <span style={smallColumn}>
                <Button onClick={() => onDismiss(item.objectID)} className="button-inline">x</Button>
              </span>
            </div>
          ))}
        </div>
      </div>
    )
}

export default Table;
