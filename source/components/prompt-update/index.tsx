import React from 'react';
import { AnswerType, PromptType, UiUpdateType } from '../../enums';
import { applyUiUpdates, getPlayerById } from '../../logic';
import { triggerDiceRoll } from '../../triggers';
import { Game, PromptUiUpdate } from '../../types';
import { Button } from '../button';
import { ChangeComponent } from '../change';
import { Modal } from '../modal';
import { AcceptDeclinePrompt } from './accept-decline-prompt';
import { CardPromptComponent } from './card-prompt';
import { OkPrompt } from './ok-prompt';
import { PlayerWinPrompt } from './player-win-prompt';

type PromptRenderer<T extends PromptType = PromptType> = (
  change: PromptUiUpdate & { promptType: T },
  game: Game,
  updateGame: (game: Game | undefined) => void,
) => React.ReactNode;

const promptsMap: {
  [TKey in PromptType]: PromptRenderer<TKey>;
} = {
  [PromptType.acceptDecline]: (change, game, updateGame) => {
    return (
      <AcceptDeclinePrompt
        acceptHandler={() => {
          updateGame(
            applyUiUpdates(game, {
              promptType: PromptType.acceptDecline,
              params: { offerAnswer: AnswerType.accept },
              uiUpdateType: UiUpdateType.prompt,
            }),
          );
        }}
        declineHandler={() => {
          updateGame(
            applyUiUpdates(game, {
              promptType: PromptType.acceptDecline,
              params: { offerAnswer: AnswerType.decline },
              uiUpdateType: UiUpdateType.prompt,
            }),
          );
        }}
      >
        <ChangeComponent change={change} game={game} />
      </AcceptDeclinePrompt>
    );
  },
  [PromptType.card]: (change, game, updateGame) => {
    return (
      <CardPromptComponent
        okHandler={() => {
          updateGame(applyUiUpdates(game, { uiUpdateType: UiUpdateType.prompt }));
        }}
        cardId={change.cardId}
        type={change.type}
      />
    );
  },
  [PromptType.confirmation]: (change, game, updateGame) => {
    return (
      <OkPrompt
        okHandler={() => {
          updateGame(applyUiUpdates(game, { uiUpdateType: UiUpdateType.prompt }));
        }}
      >
        <ChangeComponent change={change} game={game} />
      </OkPrompt>
    );
  },
  [PromptType.playerWin]: (change, game, updateGame) => {
    const winningPlayer = getPlayerById(game, change.playerId);
    return (
      <PlayerWinPrompt
        clearGameHandler={() => updateGame(undefined)}
        winningPlayer={winningPlayer}
      />
    );
  },
  [PromptType.rollDice]: (change, game, updateGame) => {
    const player = getPlayerById(game, change.playerId);

    return (
      <React.Fragment>
        <h2>{player.name}</h2>
        <Button
          onClick={() => {
            updateGame(triggerDiceRoll(game));
          }}
        >
          Roll dice
        </Button>
      </React.Fragment>
    );
  },
};

interface PromptUpdateProps {
  change: PromptUiUpdate;
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const PromptUpdate: React.FC<PromptUpdateProps> = (props) => {
  const renderer: PromptRenderer = promptsMap[props.change.promptType];
  return <Modal>{renderer(props.change, props.game, props.updateGame)}</Modal>;
};
