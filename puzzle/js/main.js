class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null,
      message: null,
    };
    this.move = this.move.bind(this);
  }

  componentDidMount() {
    this.initBoard();
  }

  initBoard() {
    // Create empty 4x4 board
    let board = Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));

    const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    const coords = [];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) coords.push([i, j]);

    numbers.forEach((n) => {
      const idx = Math.floor(Math.random() * coords.length);
      const [r, c] = coords.splice(idx, 1)[0];
      board[r][c] = n;
    });

    this.setState({ board, message: null });
  }

  move(r, c) {
    const board = this.state.board.map((row) => row.slice());
    const val = board[r][c];
    if (val === 0) return;

    const directions = [
      [r - 1, c], // up
      [r + 1, c], // down
      [r, c - 1], // left
      [r, c + 1], // right
    ];

    for (let [nr, nc] of directions) {
      if (board[nr] && board[nr][nc] === 0) {
        board[nr][nc] = val;
        board[r][c] = 0;
        break;
      }
    }

    const win =
      JSON.stringify(board) ===
      JSON.stringify([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
      ]);

    this.setState({ board, message: win ? "You win!" : null });
  }

  render() {
    const { board, message } = this.state;

    return (
      <div>
        <div className="button" onClick={() => this.initBoard()}>
          New Game
        </div>

        <table>
          <tbody>
            {board &&
              board.map((row, i) => (
                <Row key={i} row={row} rowIndex={i} move={this.move} />
              ))}
          </tbody>
        </table>

        <p>{message}</p>
      </div>
    );
  }
}

const Row = ({ row, rowIndex, move }) => {
  return (
    <tr>
      {row.map((cell, i) => (
        <Cell
          key={i}
          rowIndex={rowIndex}
          columnIndex={i}
          cellValue={cell}
          move={move}
        />
      ))}
    </tr>
  );
};

const Cell = ({ rowIndex, columnIndex, cellValue, move }) => {
  const value = cellValue === 0 ? null : cellValue;
  return (
    <td>
      <div className="cell" onClick={() => move(rowIndex, columnIndex)}>
        {value}
      </div>
    </td>
  );
};

ReactDOM.render(<App />, document.getElementById("main"));
