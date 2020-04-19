import React, { useState } from "react";

import Space from "./Space";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Game.css";

function Game(props) {
  const initState = {
    number: -1,
    events: [],
    playing: { id: true },
    playerOne: { id: true },
    playerTwo: { id: false },
    currentBoard: {
      id: "",
      gameboard: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  };
  const mancalas = [6, 13];

  const [turn, setTurn] = useState(initState);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    message: "",
    title: "",
  });
  const [errorInfo, setErrorInfo] = useState({ show: false, message: "" });

  const handleClose = () => {
    setModalInfo({
      show: false,
      message: modalInfo.message,
      title: modalInfo.title,
    });
  };

  function onNewGameClick(e) {
    e.preventDefault();
    const url = "http://localhost:8080/v1/mancala/game";

    axios
      .post(url, "", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((response) => {
        console.debug(response.data);
        setTurn(response.data);
      })
      .catch((error) => {
        console.debug(error);
        setErrorInfo({
          show: true,
          message: error.response.data.message || "Invalid move",
        });
      });
  }

  function renderTopBoard(board) {
    let spaces = [];
    for (let i = 13; i > 6; i--) {
      spaces.push(renderSingleSpace(board[i], i));
    }
    return spaces;
  }
  function renderBottomBoard(board) {
    let spaces = [];
    for (let i = 0; i < 7; i++) {
      spaces.push(renderSingleSpace(board[i], i));
    }
    return spaces;
  }

  function renderSingleSpace(numOfPebbles, position) {
    // console.info(`item ${numOfPebbles} in index ${position}`);
    return (
      <Space
        key={position}
        pebbles={numOfPebbles}
        index={position}
        isMancala={mancalas.includes(position)}
        onSpaceClick={(e) =>
          handleOnPitOrMancalaClick(e, position, numOfPebbles)
        }
      ></Space>
    );
  }

  function handleOnPitOrMancalaClick(event, position, pebbles) {
    event.preventDefault();

    let currentTurn = { ...turn };
    let move = {
      currentTurn: currentTurn,
      startPosition: position,
    };

    console.debug(
      `Inside onSpaceClick position: ${position} pebbles: ${pebbles}`
    );
    console.debug(move);

    sendMove(move);
  }

  function sendMove(move) {
    if (turn.number < 0) {
      setModalInfo({
        show: true,
        message: "Click on new game first",
        title: "alert",
      });
      return;
    }

    const url = "http://localhost:8080/v1/mancala/game/move";

    axios
      .put(url, move, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((response) => {
        console.debug(response.data);
        setTurn(response.data);
      })
      .catch((error) => {
        console.error(error);
        setErrorInfo({
          show: true,
          message: error.response.data.message || "Invalid move",
        });
      });
  }

  function renderErrors() {
    if (errorInfo.show) {
      return (
        <div>
          <h1>Error</h1>
          {errorInfo.message}
          <br />
        </div>
      );
    }
  }

  function renderEvents(events) {
    if (events.length > 0) {
      return (
        <div>
          <h1>Events</h1>
          {events.map((e, i) => renderSingleEvent(e, i))}
          <br />
        </div>
      );
    }
  }

  function renderSingleEvent(event, index) {
    return <div key={index}>{event}</div>;
  }

  function renderModal() {
    return (
      <Modal show={modalInfo.show}>
        <Modal.Header closeButton>
          <Modal.Title>{modalInfo.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{modalInfo.message}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div className="game">
      <div>
        <p>
          {turn.playing.id ? "Player: BOTTOM section" : "Player: Up section"}
        </p>
      </div>
      <Button variant="primary" size="lg" block onClick={onNewGameClick}>
        New Game
      </Button>
      <div className="spaces-top">
        {renderTopBoard(turn.currentBoard.gameboard)}{" "}
      </div>
      <div className="spaces-bottom">
        {renderBottomBoard(turn.currentBoard.gameboard)}
      </div>
      <div>{renderEvents(turn.events)}</div>
      <div>{renderErrors()}</div>
      {renderModal()}
    </div>
  );
}

export default Game;
