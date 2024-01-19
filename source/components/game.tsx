import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { toast, ToastContainer } from 'react-toastify';
import { GamePhase, GameView, SquareType, UiUpdateType } from '../enums';
import { applyUiUpdates, canBuyProperty, getCurrentPlayer, getCurrentSquare } from '../logic';
import { diceSymbol, parkingSymbol } from '../parameters';
import { triggerBuyProperty, triggerDiceRoll, triggerEndTurn } from '../triggers';
import { Game, Id, PromptUiUpdate, Square } from '../types';
import { Button } from './button';
import { ChangeComponent } from './change';
import { FinishedModal } from './finished-modal';
import { Historical } from './historical';
import { Modal } from './modal';
import { NavBar } from './nav-bar';
import { Players } from './players';
import { PromptUpdate } from './prompt-update';
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
  const [displayPromptsModal, setDisplayPromptsModal] = useState(false);

  useEffect(() => {
    refs[currentSquare.id].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [props.game]);

  const silentUpdates = props.game.uiUpdates.filter((c) => c.uiUpdateType === UiUpdateType.silent);
  const notificationUpdates = props.game.uiUpdates.filter(
    (c) => c.uiUpdateType === UiUpdateType.notification,
  );
  const promptUpdates = props.game.uiUpdates.filter(
    (c) => c.uiUpdateType === UiUpdateType.prompt,
  ) as PromptUiUpdate[];

  useEffect(() => {
    if (silentUpdates.length > 0) {
      props.updateGame(applyUiUpdates(props.game, { uiUpdateType: UiUpdateType.silent }));
    } else if (notificationUpdates.length > 0) {
      toast(
        <React.Fragment>
          {notificationUpdates.map((change, index) => (
            <ChangeComponent change={change} game={props.game} key={index} />
          ))}
        </React.Fragment>,
        { autoClose: 3000 },
      );
      props.updateGame(applyUiUpdates(props.game, { uiUpdateType: UiUpdateType.notification }));
    } else if (promptUpdates.length > 0) {
      setTimeout(() => {
        setDisplayPromptsModal(true);
      }, 800);
    }
  }, [props.game.uiUpdates]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {!isDesktop && <NavBar gameView={gameView} setGameView={setGameView} />}
      <ToastContainer />

      {displayPromptsModal ? (
        <React.Fragment>
          {promptUpdates.map((change, index) => {
            return (
              <PromptUpdate
                game={props.game}
                key={index}
                change={change}
                updateGame={(game) => {
                  setDisplayPromptsModal(false);
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
            {diceSymbol} {props.game.dice.join('-') || '-'}
          </span>
          <span style={{ fontSize: 24, padding: '0 8px' }}>
            {parkingSymbol} {props.game.centerPot}
          </span>
        </div>

        <div>
          <Button
            onClick={() => {
              props.updateGame(triggerDiceRoll(props.game));
            }}
            disabled={props.game.gamePhase !== GamePhase.rollDice}
          >
            Roll dice
          </Button>

          <Button
            onClick={() => {
              props.updateGame(triggerBuyProperty(props.game));
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
              props.updateGame(triggerEndTurn(props.game));
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
