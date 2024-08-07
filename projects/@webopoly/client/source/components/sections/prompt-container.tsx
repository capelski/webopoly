import { Game, GamePhase, GameUpdate, Player } from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  exitGame: () => void;
  game: Game;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}

export const PromptContainer: React.FC<PromptContainerProps> = (props) => {
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    if (!displayPrompt && props.game.phase === GamePhase.prompt) {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    } else if (displayPrompt && props.game.phase !== GamePhase.prompt) {
      setDisplayPrompt(false);
    }
  }, [props.game]);

  return displayPrompt && props.game.phase === GamePhase.prompt ? (
    <PromptComponent
      exitGame={props.exitGame}
      game={props.game}
      triggerUpdate={props.triggerUpdate}
      windowPlayerId={props.windowPlayerId}
    />
  ) : undefined;
};
