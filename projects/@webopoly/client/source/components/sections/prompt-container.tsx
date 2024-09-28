import { Game, GamePhase, GameUpdate, Player } from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  exitGame: () => void;
  game: Game<any>;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}

const isPromptPhase = (game: Game<any>) =>
  game.phase === GamePhase.answerOffer ||
  game.phase === GamePhase.answerTrade ||
  game.phase === GamePhase.applyCard ||
  game.phase === GamePhase.buyProperty ||
  game.phase === GamePhase.cannotPay ||
  game.phase === GamePhase.drawCard ||
  game.phase === GamePhase.goToJail ||
  game.phase === GamePhase.jailOptions ||
  game.phase === GamePhase.playerWins;

export const PromptContainer: React.FC<PromptContainerProps> = (props) => {
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    if (!displayPrompt && isPromptPhase(props.game)) {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    } else if (displayPrompt && !isPromptPhase(props.game)) {
      setDisplayPrompt(false);
    }
  }, [props.game]);

  return displayPrompt && isPromptPhase(props.game) ? (
    <PromptComponent
      exitGame={props.exitGame}
      game={props.game}
      triggerUpdate={props.triggerUpdate}
      windowPlayerId={props.windowPlayerId}
    />
  ) : undefined;
};
