import React from 'react';
import { buyProperty, endTurn, startTurn } from '../actions';
import { SquareType, TurnPhase } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare } from '../logic';
import { Game } from '../types';
import { Historical } from './historical';
import { Players } from './players';
import { SquareComponent } from './square';

interface GameComponentProps {
  clearGame: () => void;
  game: Game;
  updateGame: (game: Game) => void;
}

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);
  const currentSquare = getCurrentSquare(props.game);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            props.updateGame(startTurn(props.game));
          }}
          type="button"
          disabled={props.game.turnPhase !== TurnPhase.start}
        >
          Start turn
        </button>

        <button
          onClick={() => {
            props.updateGame(buyProperty(props.game));
          }}
          type="button"
          disabled={
            props.game.turnPhase !== TurnPhase.play ||
            currentSquare!.type !== SquareType.property ||
            !!currentSquare!.owner ||
            !canBuy(currentPlayer!, currentSquare!)
          }
        >
          Buy
        </button>

        <button
          onClick={() => {
            props.updateGame(endTurn(props.game));
          }}
          type="button"
          disabled={props.game.turnPhase !== TurnPhase.play}
        >
          End turn
        </button>

        <br />
        <br />
        {/* TODO Are you sure you want to clear the game? */}
        <button
          onClick={() => {
            props.clearGame();
          }}
          type="button"
        >
          Clear game
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {props.game.squares.map((square, index) => (
            <SquareComponent
              key={`${square.name}-${index}`}
              playersInSquare={props.game.players.filter((p) => p.position === index)}
              square={square}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, fontSize: 24 }}>
          <Players currentPlayer={props.game.currentPlayer} players={props.game.players} />
          <Historical events={props.game.events} />
        </div>
      </div>
    </div>
  );
};
