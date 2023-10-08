import React, { useState, useEffect } from 'react';
import BingoBoard from './BingoBoard';

const generateRandomNumber = () => Math.floor(Math.random() * 99) + 1;

const generateRandomBoard = () => {
  const board = [];
  const usedNumbers = new Set();

  while (board.length < 5) {
    const row = [];
    while (row.length < 5) {
      let number;
      do {
        number = generateRandomNumber();
      } while (usedNumbers.has(number));
      usedNumbers.add(number);
      row.push({ number, color: 'black' });
    }
    board.push(row);
  }

  return board;
};
const calculateBoardScore = (board, calledNumber) => {
    let unmarkedNumbersSum = 0;
  
    // Loop through the board and sum the unmarked numbers
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].color !== 'red') {
          unmarkedNumbersSum += board[row][col].number;
        }
      }
    }
  
    // Calculate the score
    const score = unmarkedNumbersSum * calledNumber;
    return score;
  };
  

const BingoGame = () => {
  const [player1Board, setPlayer1Board] = useState([]);
  const [player2Board, setPlayer2Board] = useState([]);
  const [player3Board, setPlayer3Board] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      setPlayer1Board(generateRandomBoard());
      setPlayer2Board(generateRandomBoard());
      setPlayer3Board(generateRandomBoard());
      setGameStarted(true);
    }
  }, [gameStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if ( gameStarted && !gameOver) {
        const newNumber = generateRandomNumber();
        setSelectedNumber(newNumber);

        const markNumberOnBoards = (boardState, newNum) => {
          return boardState.map((row) =>
            row.map((cell) =>
              cell.number === newNum ? { ...cell, color: 'red' } : cell
            )
          );
        };

        if (player1Board.length > 0 && player1Board.flat().some((cell) => cell.number === newNumber)) {
          setPlayer1Board((prevBoard) =>
            markNumberOnBoards(prevBoard, newNumber)
          );
        }

        if (player2Board.length > 0 && player2Board.flat().some((cell) => cell.number === newNumber)) {
          setPlayer2Board((prevBoard) =>
            markNumberOnBoards(prevBoard, newNumber)
          );
        }

        if (player3Board.length > 0 && player3Board.flat().some((cell) => cell.number === newNumber)) {
          setPlayer3Board((prevBoard) =>
            markNumberOnBoards(prevBoard, newNumber)
          );
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [player1Board, player2Board, player3Board, gameOver]);

  useEffect(() => {
    const checkWinner = (board) => {
      if (!board || board.length === 0) {
        return false;
      }

      for (let row = 0; row < 5; row++) {
        if (board[row].every((cell) => cell.color === 'red')) {
            const calledNumber = selectedNumber; 
            const score = calculateBoardScore(board, calledNumber);
            setScore(score);
             console.log(`Board Score: ${score}`);
          return true;
        }
        for (let col = 0; col < 5; col++) {
          if (
            board.every((row) => row[col].color === 'red') ||
            board.every((row) => row[col].color === 'red')
          ) {
            const calledNumber = selectedNumber; 
            const score = calculateBoardScore(board, calledNumber);
            console.log(`Board Score: ${score}`);
            setScore(score);
            return true;
          }
        }
      }
      return false;
    };

    if (!winner) {
      if (checkWinner(player1Board)) {
        setWinner('Player 1');
        setGameOver(true);
      } else if (checkWinner(player2Board)) {
        setWinner('Player 2');
        setGameOver(true);
      } else if (checkWinner(player3Board)) {
        setWinner('Player 3');
        setGameOver(true);
      }
    }
  }, [player1Board, player2Board, player3Board, winner]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
    setSelectedNumber(null);
  };

  return (
    <div className="bingo-container">
      <h1> Kimy Bingo Game</h1>
      {!gameStarted && !gameOver && <button className='start-btn' onClick={startGame}>Start Game</button>}
      {selectedNumber && <h2>Selected Number: {selectedNumber}</h2>}
      <div className="boards">
        <BingoBoard board={player1Board} caption="Player 1" />
        <BingoBoard board={player2Board} caption="Player 2" />
        <BingoBoard board={player3Board} caption="Player 3" />
      </div>
      {winner && <h2>{`${winner} Wins ! Congrats! `} &#x1F389;&#x1F389;<h2>Board Winner Score: {score}</h2> </h2>} 
    </div>
  );
};

export default BingoGame;
