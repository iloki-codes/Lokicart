import { useEffect, useState } from "react";
import { Combination } from "js-combinatorics";

type Grid = { [key: number]: "X" | "O" | null };

const keys = [2, 7, 6, 9, 5, 1, 4, 3, 8];

const winningCombos = new Combination(keys, 3).toArray().filter(
  (nums) => nums.reduce((acc, num) => acc + num) === 15
);

const hasWinner = (grid: Grid): "X" | "O" | null =>
  winningCombos
    .map((combo) => combo.map((key) => grid[key]))
    .some((comboValues) => comboValues.every((v) => v === "X"))
    ? "X"
    : winningCombos.some((comboValues) => comboValues.every((v) => v === "O"))
    ? "O"
    : null;

class Game {
  private _grid: Grid;

  constructor() {
    this._grid = keys.reduce(
      (grid, key) => Object.assign(grid, { [key]: null }),
      {} as Grid
    );
  }

  get turn(): "X" | "O" {
    const counts = Object.values(this._grid).reduce(
      (acc, value) => {
        if (value === "X") acc.Xs += 1;
        else if (value === "O") acc.Os += 1;
        return acc;
      },
      { Xs: 0, Os: 0 }
    );
    return counts.Xs > counts.Os ? "O" : "X";
  }

  get winner(): "X" | "O" | null {
    return hasWinner(this._grid);
  }

  get isFull(): boolean {
    return Object.entries(this._grid).every(([_, value]) => !!value);
  }

  get availableCells(): number[] {
    return keys.filter((key) => !this._grid[key]);
  }

  getCell = (key: number): "X" | "O" | null =>
    key in this._grid ? this._grid[key] : null;

  setCell = (key: number, symbol?: "X" | "O") => {
    if (!this.winner && key in this._grid && !this._grid[key]) {
      this._grid[key] = symbol || this.turn;
    }
  };

  get cellNames(): number[] {
    return keys;
  }

  clone(): Game {
    const newGame = new Game();
    newGame['_grid'] = { ...this._grid };
    return newGame;
  }
}

interface GameState {
  game: Game;
}

const initialGame = (): GameState => ({ game: new Game() });

const TicTacToe = () => {
  const [state, setState] = useState<GameState>(initialGame());

  // Minimax algorithm
  const minimax = (game: Game, depth: number, isMaximizing: boolean): number => {
    const winner = game.winner;
    if (winner === "O") return 10 - depth; // "O" wins, lower depth = faster win
    if (winner === "X") return -10 + depth; // "X" wins, higher depth = slower loss
    if (game.isFull) return 0; // Draw

    const available = game.availableCells;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const key of available) {
        const tempGame = game.clone();
        tempGame.setCell(key, "O");
        const score = minimax(tempGame, depth + 1, false);
        bestScore = Math.max(bestScore, score);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const key of available) {
        const tempGame = game.clone();
        tempGame.setCell(key, "X");
        const score = minimax(tempGame, depth + 1, true);
        bestScore = Math.min(bestScore, score);
      }
      return bestScore;
    }
  };

  const computerMove = () => {
    const available: number[] = state.game.availableCells;
    if (available.length === 0 || state.game.turn !== "O" || state.game.winner) return;

    // 10% chance of a random move (to make it 90% unbeatable)
    if (Math.random() < 0.10) {
      const randomIndex = Math.floor(Math.random() * available.length);
      state.game.setCell(available[randomIndex]);
      setState({ ...state });
      return;
    }

    // Find the best move using Minimax
    let bestScore = -Infinity;
    let bestMove: number | null = null;

    for (const key of available) {
      const tempGame = state.game.clone();
      tempGame.setCell(key, "O");
      const score = minimax(tempGame, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = key;
      }
    }

    if (bestMove !== null) {
      state.game.setCell(bestMove);
      setState({ ...state });
    }
  };

  useEffect(() => {
    if (state.game.turn === "O" && !state.game.winner && !state.game.isFull) {
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const update = (value: number | "Restart") => {
    switch (value) {
      case "Restart":
        setState(initialGame());
        break;
      default:
        if (state.game.turn === "X") {
          state.game.setCell(value);
          setState({ ...state });
        }
        break;
    }
  };

  const Cell = (key: number) => (
    <button
      className="cell"
      key={key}
      id={`cell${key}`}
      onClick={() => update(key)}
      disabled={state.game.getCell(key) !== null || state.game.turn !== "X"}
    >
      {state.game.getCell(key) ?? ""}
    </button>
  );

  const statusMessage = (() => {
    if (state.game.winner) return `${state.game.winner} won the game!`;
    else if (state.game.isFull) return "The game is a draw!";
    else return `${state.game.turn === "X" ? "Your turn (X)" : "Computer's turn (O)"}`;
  })();

  return (
    <div className="tictac">
      <div id="gamebox">{state.game.cellNames.map(Cell)}</div>
      <div id="status">{statusMessage}</div>
      <button onClick={() => update("Restart")}>Restart</button>
    </div>
  );
};

export default TicTacToe;

// //Added a minimax function that recursively evaluates all possible game outcomes.
// Scores: +10 for "O" win, -10 for "X" win, 0 for draw, adjusted by depth to favor quicker wins or slower losses.
// isMaximizing toggles between "O" (maximizing) and "X" (minimizing).Loops through available cells, simulates each move with "O", and uses Minimax to score it.
// Picks the move with the highest score.