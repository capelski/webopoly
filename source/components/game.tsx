import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast, ToastContainer } from 'react-toastify';
import { applyNotifications, buyProperty, endTurn, rollDice } from '../actions';
import { GameView, SquareType, TurnPhase } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare, getPlayerById } from '../logic';
import { diceSymbol, parkingSymbol } from '../parameters';
import { Game } from '../types';
import { GameEventComponent } from './game-event';
import { Historical } from './historical';
import { NavBar } from './nav-bar';
import { Players } from './players';
import { SquareComponent } from './square';

interface GameComponentProps {
  clearGame: () => void;
  game: Game;
  updateGame: (game: Game) => void;
}

const buttonStyles: CSSProperties = {
  padding: 8,
  outline: 'none',
  marginRight: 8,
};

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);
  const currentSquare = getCurrentSquare(props.game);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [gameView, setGameView] = useState(GameView.board);
  const [refs] = useState(props.game.squares.map(() => useRef<HTMLDivElement>(null)));

  useEffect(() => {
    refs[currentSquare.position].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [props.game]);

  useEffect(() => {
    if (props.game.notifications.length > 0) {
      toast(
        <React.Fragment>
          {props.game.notifications.map((x, index) => (
            <GameEventComponent event={x} key={index} />
          ))}
        </React.Fragment>,
        { autoClose: 3000 },
      );
      props.updateGame(applyNotifications(props.game));
    }
  }, [props.game.notifications]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!isDesktop && <NavBar gameView={gameView} setGameView={setGameView} />}
      <ToastContainer />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {(isDesktop || gameView === GameView.board) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              padding: isDesktop ? 8 : undefined,
              overflow: 'scroll',
            }}
          >
            {props.game.squares.map((square, index) => (
              <SquareComponent
                key={`${square.name}-${index}`}
                rootRef={refs[index]}
                currentPlayerId={props.game.currentPlayerId}
                playersInSquare={props.game.players.filter((p) => p.position === square.position)}
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

        {(isDesktop || gameView === GameView.players) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              overflow: 'scroll',
            }}
          >
            <div style={{ position: 'sticky', backgroundColor: 'white', top: 0, padding: 8 }}>
              <Players currentPlayerId={props.game.currentPlayerId} players={props.game.players} />
            </div>

            <div style={{ padding: 8 }}>
              <Historical events={props.game.events} />
            </div>
          </div>
        )}
      </div>

      <div style={{ background: '#efefef', position: 'sticky', bottom: 0, padding: 8 }}>
        <div>
          <span style={{ fontSize: 24, padding: '0 8px' }}>
            {diceSymbol} {props.game.dice.join('-') || '-'}
          </span>
          <span style={{ fontSize: 24, padding: '0 8px' }}>
            {parkingSymbol} {props.game.centerPot}
          </span>
        </div>

        <div>
          <button
            onClick={() => {
              props.updateGame(rollDice(props.game));
            }}
            type="button"
            style={buttonStyles}
            disabled={props.game.turnPhase !== TurnPhase.rollDice}
          >
            Roll dice
          </button>

          <button
            onClick={() => {
              props.updateGame(buyProperty(props.game));
            }}
            type="button"
            style={buttonStyles}
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
            style={buttonStyles}
            disabled={props.game.turnPhase !== TurnPhase.play}
          >
            End turn
          </button>
          <div style={{ marginTop: 8 }}>
            {/* TODO Are you sure you want to clear the game? */}
            <button
              onClick={() => {
                props.clearGame();
              }}
              type="button"
              style={{ ...buttonStyles, color: 'red' }}
            >
              Clear game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
