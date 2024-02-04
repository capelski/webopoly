import React, { useEffect, useState } from 'react';
import { GamePhase } from '../../enums';
import { Game } from '../../types';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const PromptContainer: React.FC<PromptContainerProps> = (props) => {
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    if (!displayPrompt && props.game.phase === GamePhase.prompt) {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    }
  }, [props.game]);

  return displayPrompt && props.game.phase === GamePhase.prompt ? (
    <PromptComponent
      game={props.game}
      updateGame={(game) => {
        setDisplayPrompt(false);
        return props.updateGame(game);
      }}
    />
  ) : undefined;
};
