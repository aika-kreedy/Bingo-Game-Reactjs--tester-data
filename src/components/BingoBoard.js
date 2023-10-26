import React from 'react';

const BingoBoard = ({ board, caption }) => {
  return (
    <table className="board">
      <caption>{caption}</caption>
      <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td className={`cell ${cell.color}`} key={colIndex}>
                {cell.number}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BingoBoard;