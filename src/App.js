import { useState } from 'react';

function Square({value, onSquareClick}) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X"
        }else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }
    const winner = calculateWinner(squares);
    let status;
    const draw = checkDraw(squares)

    if (winner) {
        status = "Winner: " + winner;
    } else if(draw) {
        status = "It's a Draw"
    }else {
        status = "Next Player: " + (xIsNext ? "X" : "O");
    }

    const renderSquare = (i) => {
        return(
            <Square
            key={i} 
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            />
        )
    }

    return (
        <>
        <div className="status">{status}</div>
        {[...Array(3).keys()].map((i) => (
            <div key={i}>{[...Array(3).keys()].map((j) => renderSquare(3 * i + j))}</div>
        ))}
        
        {/* <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
            <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
            <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
            <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
            <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
            <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
            <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
        </div> */}
        </>
    )
  }

  export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [sortAscending, setSortAscending] = useState(true)
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        if (move === (history.length - 1)) {
            return(
                <li key={move}>
                    <p>You are at move# {move + 1}</p>
                </li>
            )
        } else{
            return(
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            )
        }
        
    })

    const descStyle = {
        display: "flex",
        flexDirection: "column-reverse"
    };

    return (
        <div className="game">
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className='game-info'>
                <button onClick={() => setSortAscending((prev) => !prev)}>
                    Sort: {sortAscending ? "Ascending" : "Descending"}
                </button>
                <ul style={sortAscending ? {} : descStyle}>{moves}</ul>
            </div>
        </div>
    )
  }

  function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
  }

  function checkDraw(squares) {
    let draw = true;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            console.log("square "+ i + ": " + squares[i])
            draw = false;
        }
    }
    console.log("checkDraw: " + draw)
    return draw
}
  