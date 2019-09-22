import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './Game.css';
import * as serviceWorker from './serviceWorker';

function Square(props) {
    const win = props.squaresWin.indexOf(props.index) != -1 ? 'win' : null;
    const classes = `square ${win}`;
    return (
        // <div className={>
            <button className={classes} onClick={props.onClick}>
                {props.value}
            </button>
        // </div>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                squaresWin={this.props.squaresWin}
                key={i}
                index={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        var rows = [];
        for (var i = 0; i < 20; i++) {
            var tmp = [];
            for (var j = 0; j < 20; j++) {
                var val = i * 20 + j;
                tmp.push(this.renderSquare(val));
            }
            rows.push(
                <div key={val} className="board-row">
                    {tmp}
                </div>
            );
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(400).fill(null),
                position: []
            }],
            position: [],
            xIsNext: true,
            status: 'Next player: X',
            isWin: false,
            stepNumber: 0,
            active: -1,
            squaresWin: [],
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const positions = current.position.slice();
        if (!squares[i] && !calculateWinner(squares)) {
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares,
                    position: positions.concat(String(i))
                }]),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length,
            });
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            active: step,
            squaresWin: []
        });
    }

    backStep() {
        let step = this.state.stepNumber - 1;

        if (step === 0) return;
        this.jumpTo(step);
    }
    nextStep() {
        let step = this.state.stepNumber + 1;
        if (step === this.state.history.length) return;
        this.jumpTo(step);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' Position:#' :
                'Go to game start';
            return (
                <li key={move} >
                    <button className={this.state.active === move ? 'active' : null} onClick={() => this.jumpTo(move)}>{desc} {step.position[move - 1]}</button>
                </li>
            );
        });

        if (winner) {
            this.state.status = 'Winner: ' + current.squares[winner[0]];
            this.state.isWin = true;
            this.state.squaresWin = winner;
        } else {
            this.state.status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-info">
                    <div className="status">
                        {this.state.status}
                        <div className="step">
                            <button onClick={() => this.backStep()}>Back</button>
                            <button onClick={() => this.nextStep()}>Next</button>
                        </div>
                    </div>
                    <ol>{moves}</ol>
                </div>
                <div className="game-board">
                    <Board squares={current.squares}
                        squaresWin={this.state.squaresWin}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
            </div>
        );
    }
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [];
    //case 1
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 16; j++) {
            var tmp = [];
            for (var k = 0; k < 5; k++) tmp.push(i * 20 + j + k);
            lines.push(tmp);
        }
    }
    //case 2
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 20; j++) {
            var tmp = [];
            for (var k = 0; k < 5; k++) {
                tmp.push((i + k) * 20 + j);
            }
            lines.push(tmp);
        }
    }

    //case 3
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            var tmp = [];
            for (var k = 0; k < 5; k++) {
                var value = (i + k) * 20 + k + j;
                tmp.push(value);
            }
            lines.push(tmp);
        }
    }

    //case 4
    for (var i = 0; i < 16; i++) {
        for (var j = 19; j > 3; j--) {
            var tmp = [];
            for (var k = 0; k < 5; k++) {
                var value = (i + k) * 20 + j - k;
                tmp.push(value);
            }
            lines.push(tmp);
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
            // case 1

            if (b - a === 1) {
                var count = 0;
                var rowA = Math.floor(a / 20);
                var colA = a % 20;
                var rowE = Math.floor(e / 20);
                var colE = e % 20;

                for (let j = rowA * 20; j < rowA * 20 + colA; j++) {
                    if (squares[j] != squares[a] && squares[j]) {
                        count = count + 1;
                        break;
                    }
                }

                for (let j = rowE * 20 + colE + 1; j < rowE * 20 + 20; j++) {
                    if (squares[j] && squares[j] != squares[a]) {
                        count = count + 1;
                        break;
                    }
                }
                if (count <= 1) {
                    return [a, b, c, d, e];
                }
            }

            //case 2
            else if (b - a === 20) {
                var rowA = Math.floor(a / 20);
                var rowE = Math.floor(e / 20);
                var j = a % 20;
                var count = 0;
                for (var id = 0; id < rowA; id++) {
                    var idx = id * 20 + j;
                    if (squares[idx] && squares[idx] != squares[a]) {
                        count = count + 1;
                        break;
                    }
                }

                for (var id = rowE + 1; id < 20; id++) {
                    var idx = id * 20 + j;
                    count = count + 1;
                    break;
                }
                if (count <= 1) return [a, b, c, d, e];

            }

            //case 3
            else if (b - a === 21) {
                var count = 0;
                var rowA = Math.floor(a / 20);
                var colA = Math.floor(a % 20);
                var rowStart = rowA - colA;

                var rowE = Math.floor(a / 20);
                var colE = a % 20;
                var start = rowE * 20 + colE;
                for (var j = 0; j < colA; j++) {
                    var value = (rowStart + j) * 20 + j;
                    if (squares[value] && squares[value] != squares[a]) {
                        count = count + 1;
                        break;
                    }
                }
                for (var id = rowE + 1; id < 20; id++) {
                    if (squares[start + 21] && squares[start + 21] != squares[e]) {
                        count = count + 1;
                        break;
                    }
                    start = start + 21;
                }
                if (count <= 1) {
                    return [a, b, c, d, e];
                }
            }

            //case 4
            //b-a=19
            else {
                var count = 0;
                var rowA = Math.floor(a / 20);
                var colA = a % 20;
                var rowE = Math.floor(e / 20);
                var colE = e % 20;
                var rowStart = rowA - 20 + colA;
                var start = (rowA - 1) * 20 + colA + 1;
                for (var j = rowA - 1; j >= rowStart; j--) {
                    if (squares[start] && squares[a] != squares[start]) {
                        count = count + 1;
                        break;
                    }
                    start = start - 19;
                }

                var rowEnd = 19;
                if (colE < (19 - rowE)) {
                    rowEnd = rowE + colE;
                }
                var end = rowE * 20 + colE + 19;
                for (var j = rowE + 1; j <= rowEnd; j++) {
                    if (squares[end] && squares[end] != squares[e]) {
                        count = count + 1;
                        break;
                    }
                    end = end + 19;
                }

                if (count <= 1) return [a, b, c, d, e];
            }
        }
    }
    return null;
}


serviceWorker.unregister();
