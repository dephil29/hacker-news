import React, {Component} from "react";
import Button from "../Button";
import "./index.css";

function Table(props) {
    const {list, onDismiss} = props;
    return(
      <div>
        <div className="table">
        {list.map(item => (
            <div key={item.objectID} className="table-row">
            <div className="title">
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
            </div>
            <div className="info">
              <span>author: {item.author} | </span>
              <span>comments: {item.num_comments} | </span>
              <span>points: {item.points} | </span>
              <span>
                <Button onClick={() => onDismiss(item.objectID)} className="button-inline">hide</Button>
              </span>
            </div>
            </div>
          ))}
        </div>
      </div>
    )
}

export default Table;
