import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { buyProperty, endTurn, startTurn } from '../actions';
import { SquareType, TurnPhase } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare, getPlayerById } from '../logic';
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
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [currentView, setCurrentView] = useState<'board' | 'players'>('board');

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
            currentSquare!.ownerId !== undefined ||
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
        <br />
        <br />
      </div>

      <div style={{ paddingLeft: 8, fontSize: 24, marginBottom: 16 }}>
        🎲 {props.game.dice || '-'}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh',
        }}
      >
        {(isDesktop || currentView === 'board') && (
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {props.game.squares.map((square, index) => (
              <SquareComponent
                key={`${square.name}-${index}`}
                playersInSquare={props.game.players.filter((p) => p.position === index)}
                square={square}
                owner={
                  square.type === SquareType.property && square.ownerId !== undefined
                    ? getPlayerById(props.game, square.ownerId)
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {(isDesktop || currentView === 'players') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            <Players currentPlayerId={props.game.currentPlayerId} players={props.game.players} />
            <Historical events={props.game.events} />
          </div>
        )}
      </div>

      {!isDesktop && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: 32,
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            borderTop: '1px solid lightgrey',
          }}
        >
          <div
            onClick={() => setCurrentView('board')}
            style={{
              textShadow: currentView === 'board' ? '0 0 5px goldenrod' : undefined,
              paddingTop: 8,
              textAlign: 'center',
              flexGrow: 1,
            }}
          >
            🧭
          </div>
          <div
            onClick={() => setCurrentView('players')}
            style={{
              textShadow: currentView === 'players' ? '0 0 5px goldenrod' : undefined,
              paddingTop: 8,
              textAlign: 'center',
              flexGrow: 1,
            }}
          >
            👤
          </div>
        </div>
      )}
    </div>
  );
};
