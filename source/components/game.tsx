import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast, ToastContainer } from 'react-toastify';
import {
  applyNotifications,
  buyCurrentProperty,
  clearMortgage,
  endTurn,
  mortgage,
  rollDice,
} from '../actions';
import { GamePhase, GameView, NotificationType, SquareType } from '../enums';
import { canBuyProperty, getCurrentPlayer, getCurrentSquare, getPlayerById } from '../logic';
import { diceSymbol, parkingSymbol } from '../parameters';
import { Game, Id, ModalNotification, Square } from '../types';
import { Button } from './button';
import { FinishedModal } from './finished-modal';
import { GameEventComponent } from './game-event';
import { Historical } from './historical';
import { Modal } from './modal';
import { NavBar } from './nav-bar';
import { NotificationModal } from './notification-modal';
import { Players } from './players';
import { SquareComponent } from './square';

interface GameComponentProps {
  clearGame: () => void;
  game: Game;
  updateGame: (game: Game) => void;
}

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

  const modals = props.game.notifications.filter(
    (n) => n.notificationType === NotificationType.modal,
  );
  const toasts = props.game.notifications.filter(
    (n) => n.notificationType === NotificationType.toast,
  );

  useEffect(() => {
    if (toasts.length) {
      toast(
        <React.Fragment>
          {toasts.map((toast, index) => (
            <GameEventComponent event={toast} game={props.game} key={index} />
          ))}
        </React.Fragment>,
        { autoClose: 3000 },
      );
      props.updateGame(applyNotifications(props.game, NotificationType.toast));
    } else if (modals.length) {
      setTimeout(() => {
        setDisplayModal(true);
      }, 800);
    }
  }, [props.game.notifications]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!isDesktop && <NavBar gameView={gameView} setGameView={setGameView} />}
      <ToastContainer />

      {displayModal ? (
        <React.Fragment>
          {modals.map((modal, index) => {
            return (
              <NotificationModal
                game={props.game}
                key={index}
                modal={modal as unknown as ModalNotification}
                updateGame={(game) => {
                  setDisplayModal(false);
                  return props.updateGame(game);
                }}
              />
            );
          })}
        </React.Fragment>
      ) : undefined}

      {props.game.gamePhase === GamePhase.finished && (
        <FinishedModal clearGame={props.clearGame} game={props.game} />
      )}

      {clearGameModal && (
        <Modal>
          <div>Are you sure you want to clear the game?</div>
          <div>
            <Button onClick={() => props.clearGame()}>Yes</Button>
            <Button onClick={() => setClearGameModal(false)}>No</Button>
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
                clearMortgage={() => {
                  props.updateGame(clearMortgage(props.game, square.id));
                }}
                currentPlayer={currentPlayer}
                gamePhase={props.game.gamePhase}
                key={`${square.name}-${square.id}`}
                mortgage={() => {
                  props.updateGame(mortgage(props.game, square.id));
                }}
                owner={
                  'ownerId' in square && square.ownerId !== undefined
                    ? getPlayerById(props.game, square.ownerId)
                    : undefined
                }
                playersInSquare={props.game.players.filter((p) => p.squareId === square.id)}
                rootRef={refs[square.id]}
                square={square}
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
          <Button
            onClick={() => {
              props.updateGame(rollDice(props.game));
            }}
            disabled={props.game.gamePhase !== GamePhase.rollDice}
          >
            Roll dice
          </Button>

          <Button
            onClick={() => {
              props.updateGame(buyCurrentProperty(props.game));
            }}
            disabled={
              props.game.gamePhase !== GamePhase.play ||
              currentSquare.type !== SquareType.property ||
              !canBuyProperty(currentSquare, currentPlayer!)
            }
          >
            Buy
          </Button>

          <Button
            onClick={() => {
              props.updateGame(endTurn(props.game));
            }}
            disabled={props.game.gamePhase !== GamePhase.play}
          >
            End turn
          </Button>

          <div style={{ marginTop: 8 }}>
            <Button
              onClick={() => {
                setClearGameModal(true);
              }}
              style={{ color: 'red' }}
            >
              Clear game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
