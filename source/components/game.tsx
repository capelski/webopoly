import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Id, toast, ToastContainer } from 'react-toastify';
import { GameView, SquareType } from '../enums';
import { canBuyProperty, diceToString, getCurrentPlayer, getCurrentSquare } from '../logic';
import { diceSymbol, parkingSymbol } from '../parameters';
import { triggerBuyProperty, triggerDiceRoll, triggerEndTurn } from '../triggers';
import { Game, Square } from '../types';
import { Button } from './common/button';
import { Modal } from './common/modal';
import { NotificationComponent } from './common/notification';
import { Historical } from './historical';
import { NavBar } from './nav-bar';
import { Players } from './player/players';
import { PromptComponent } from './prompt/prompt';
import { SquareComponent } from './square/square';

interface GameComponentProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
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
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    refs[currentSquare.id].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [props.game]);

  useEffect(() => {
    if (props.game.notifications.length > 0) {
      props.game.notifications.forEach((notification) => {
        toast(<NotificationComponent notification={notification} game={props.game} />, {
          autoClose: 3000,
        });
      });
      props.updateGame({
        ...props.game,
        notifications: [],
        pastNotifications: [...props.game.notifications, ...props.game.pastNotifications],
      });
    }
  }, [props.game.notifications]);

  useEffect(() => {
    if (props.game.prompt && !displayPrompt) {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    }
  }, [props.game.prompt]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!isDesktop && <NavBar gameView={gameView} setGameView={setGameView} />}
      <ToastContainer />

      {displayPrompt && props.game.prompt ? (
        <PromptComponent
          game={props.game}
          prompt={props.game.prompt}
          updateGame={(game, keepPromptDisplay = false) => {
            if (!keepPromptDisplay) {
              setDisplayPrompt(false);
            }
            return props.updateGame(game);
          }}
        />
      ) : undefined}

      {clearGameModal && (
        <Modal>
          <div>Are you sure you want to clear the game?</div>
          <div>
            <Button onClick={() => props.updateGame(undefined)}>Yes</Button>
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
                game={props.game}
                key={`${square.name}-${square.id}`}
                rootRef={refs[square.id]}
                square={square}
                updateGame={props.updateGame}
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
            {diceSymbol} {diceToString(props.game.dice)}
          </span>
          <span style={{ fontSize: 24, padding: '0 8px' }}>
            {parkingSymbol} {props.game.centerPot}
          </span>
        </div>

        <div>
          <Button
            disabled={
              !props.game.mustStartTurn || (props.game.mustStartTurn && !!props.game.prompt)
            }
            onClick={() => {
              props.updateGame(triggerDiceRoll(props.game));
            }}
          >
            Roll dice
          </Button>

          <Button
            onClick={() => {
              props.updateGame(triggerBuyProperty(props.game));
            }}
            disabled={
              currentSquare.type !== SquareType.property ||
              !canBuyProperty(currentSquare, currentPlayer!)
            }
          >
            Buy
          </Button>

          <Button
            disabled={props.game.mustStartTurn || !!props.game.prompt}
            onClick={() => {
              props.updateGame(triggerEndTurn(props.game));
            }}
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
