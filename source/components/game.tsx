import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast, ToastContainer } from 'react-toastify';
import { applyModals, applyToasts, buyProperty, endTurn, rollDice } from '../actions';
import { GamePhase, GameView, PlayerStatus } from '../enums';
import {
  canBuy,
  getCurrentPlayer,
  getCurrentSquare,
  getPlayerById,
  toPropertySquare,
} from '../logic';
import { diceSymbol, parkingSymbol } from '../parameters';
import { Game, Id, Square } from '../types';
import { GameEventComponent } from './game-event';
import { Historical } from './historical';
import { Modal } from './modal';
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

const getSquaresRefs = (
  squares: Square[],
): { [key: Id]: React.MutableRefObject<HTMLDivElement | null> } => {
  return squares.reduce<{ [key: Id]: React.MutableRefObject<HTMLDivElement | null> }>(
    (reduced, square) => ({ ...reduced, [square.id]: useRef<HTMLDivElement>(null) }),
    {},
  );
};

export const GameComponent: React.FC<GameComponentProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);
  const currentSquare = getCurrentSquare(props.game);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [gameView, setGameView] = useState(GameView.board);
  const [clearGameModal, setClearGameModal] = useState(false);
  const [refs] = useState(getSquaresRefs(props.game.squares));
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    refs[currentSquare.id].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [props.game]);

  useEffect(() => {
    if (props.game.gamePhase === GamePhase.toast) {
      toast(
        <React.Fragment>
          {props.game.toasts.map((toast, index) => (
            <GameEventComponent event={toast} game={props.game} key={index} />
          ))}
        </React.Fragment>,
        { autoClose: 3000 },
      );
      props.updateGame(applyToasts(props.game));
    } else if (props.game.gamePhase === GamePhase.modal) {
      setTimeout(() => {
        setDisplayModal(true);
      }, 800);
    }
  }, [props.game.gamePhase]);

  const propertySquare = toPropertySquare(currentSquare);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!isDesktop && <NavBar gameView={gameView} setGameView={setGameView} />}
      <ToastContainer />

      {displayModal && (
        <Modal>
          <React.Fragment>
            {props.game.modals.map((modal, index) => (
              <GameEventComponent event={modal} game={props.game} key={index} />
            ))}
          </React.Fragment>
          <button
            onClick={() => {
              setDisplayModal(false);
              props.updateGame(applyModals(props.game));
            }}
            type="button"
            style={buttonStyles}
          >
            Ok
          </button>
        </Modal>
      )}

      {props.game.gamePhase === GamePhase.finished && (
        <Modal>
          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            {props.game.players.find((p) => p.status === PlayerStatus.playing)!.name} wins the game
          </div>
          <div style={{ fontSize: 72, marginBottom: 32 }}>🏆🎉</div>
          <button
            onClick={() => {
              props.clearGame();
            }}
            type="button"
            style={buttonStyles}
          >
            Clear game
          </button>
        </Modal>
      )}

      {clearGameModal && (
        <Modal>
          <div>Are you sure you want to clear the game?</div>
          <div>
            <button type="button" onClick={() => props.clearGame()}>
              Yes
            </button>
            <button type="button" onClick={() => setClearGameModal(false)}>
              No
            </button>
          </div>
        </Modal>
      )}

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
              padding: isDesktop ? 8 : undefined,
              overflow: 'scroll',
              width: isDesktop ? '50%' : '100%',
            }}
          >
            {props.game.squares.map((square) => (
              <SquareComponent
                key={`${square.name}-${square.id}`}
                rootRef={refs[square.id]}
                currentPlayerId={props.game.currentPlayerId}
                playersInSquare={props.game.players.filter((p) => p.squareId === square.id)}
                square={square}
                owner={
                  'ownerId' in square && square.ownerId !== undefined
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
              overflow: 'scroll',
              width: isDesktop ? '50%' : '100%',
            }}
          >
            <div style={{ position: 'sticky', backgroundColor: 'white', top: 0, padding: 8 }}>
              <Players currentPlayerId={props.game.currentPlayerId} players={props.game.players} />
            </div>

            <div style={{ padding: 8 }}>
              <Historical game={props.game} />
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
            disabled={props.game.gamePhase !== GamePhase.rollDice}
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
              props.game.gamePhase !== GamePhase.play ||
              !propertySquare ||
              !canBuy(currentPlayer!, propertySquare)
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
            disabled={props.game.gamePhase !== GamePhase.play}
          >
            End turn
          </button>

          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => {
                setClearGameModal(true);
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
