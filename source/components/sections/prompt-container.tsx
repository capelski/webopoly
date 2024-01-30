import React, { useEffect, useState } from 'react';
import { Game } from '../../types';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const PromptContainer: React.FC<PromptContainerProps> = (props) => {
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    if (!displayPrompt && typeof props.game.status === 'object') {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    }
  }, [props.game.status]);

  return displayPrompt && typeof props.game.status === 'object' ? (
    <PromptComponent
      game={props.game}
      prompt={props.game.status}
      updateGame={(game) => {
        setDisplayPrompt(false);
        return props.updateGame(game);
      }}
    />
  ) : undefined;
};
