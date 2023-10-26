import React, { useState, useEffect } from 'react';
import BingoBoard from './BingoBoard';

const playerBoardsData = [
  [
    [22, 13, 17, 11, 0],
    [8, 2, 23, 4, 24],
    [21, 9, 14, 16, 7],
    [6, 10, 3, 18, 5],
    [1, 12, 20, 15, 19]
  ],
  [
    [3, 15, 0, 2, 22],
    [9, 18, 13, 17, 5],
    [19, 8, 7, 25, 23],
    [20, 11, 10, 24, 4],
    [14, 21, 16, 12, 6]
  ],
  [
    [14, 21, 17, 24, 4],
    [10, 16, 15, 9, 19],
    [18, 8, 23, 26, 20],
    [22, 11, 13, 6, 5],
    [2, 0, 12, 3, 7]
  ]
];


const initialDrawNumbers = [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1];

const BingoGame = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawNumbers, setDrawNumbers] = useState([...initialDrawNumbers]);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false); // Flag to track game over

  useEffect(() => {
    const interval = setInterval(() => {
      if (drawNumbers.length > 0 && !gameOver) {
        const newNumber = drawNumbers[0];

        setSelectedNumbers(prevNumbers => [...prevNumbers, newNumber]);

        // Remove the used number from drawNumbers
        setDrawNumbers(prevDrawNumbers => prevDrawNumbers.slice(1));

        const winningPlayer = checkWinner(playerBoardsData, selectedNumbers);
        if (winningPlayer !== null) {
          setGameOver(true); // Set the game over flag
          const score = calculateScore(playerBoardsData[winningPlayer - 1], newNumber);
          setWinner(`Player ${winningPlayer} wins with a score of ${score}! Game Over`);
        }

        if (drawNumbers.length === 0 && !gameOver) {
          setGameOver(true); // Set the game over flag
          setWinner('No winner. All numbers have been drawn. Game Over');
        }
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [drawNumbers, selectedNumbers, winner, gameOver]);

  const checkWinner = (boards, numbers) => {
    for (let i = 0; i < boards.length; i++) {
      const playerBoard = boards[i];
      // Check rows
      for (let row = 0; row < 5; row++) {
        if (playerBoard[row].every(cell => numbers.includes(cell))) {
          return i + 1;
        }
      }

      // Check columns
      for (let col = 0; col < 5; col++) {
        if (playerBoard.every(row => numbers.includes(row[col]))) {
          return i + 1;
        }
      }
    }

    return null;
  };

  const calculateScore = (board, winningNumber) => {
    const unmarkedNumbers = board.flat().filter(number => !selectedNumbers.includes(number));
    const score = unmarkedNumbers.reduce((total, number) => total + number, 0);
    return score * winningNumber;
  };

  return (
    <div className="bingo-container">
      <h1>Kimy Bingo Game</h1>
      <h2>Selected Numbers: {selectedNumbers.join(', ')}</h2>
      <div className="boards">
        {playerBoardsData.map((_, index) => (
          <BingoBoard
            key={index}
            board={playerBoardsData[index].map(row =>
              row.map(number => ({
                number,
                color: selectedNumbers.includes(number) ? 'red' : 'black'
              }))
            )}
            caption={`Player ${index + 1}`}
          />
        ))}
      </div>
      {winner && <h2>{winner}</h2>}
    </div>
  );
};

export default BingoGame;
