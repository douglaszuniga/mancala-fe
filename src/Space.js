import React from "react";
import "./Space.css";

function Space(props) {
  return (
    <div className="space">
      <div
        className={props.isMancala ? `mancala` : `pit`}
        onClick={props.onSpaceClick}
      >
        <p>{props.pebbles}</p>
        <p>{props.index}</p>
      </div>
    </div>
  );
}

export default Space;
