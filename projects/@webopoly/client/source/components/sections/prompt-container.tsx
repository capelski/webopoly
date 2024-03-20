import React, { useEffect, useState } from 'react';
import { Game, GamePhase, Player } from '../../../../core';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  exitGame: () => void;
  game: Game;
  updateGame: (game: Game) => void;
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
      updateGame={props.updateGame}
      windowPlayerId={props.windowPlayerId}
    />
  ) : undefined;
};
