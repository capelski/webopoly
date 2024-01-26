import React, { useEffect, useState } from 'react';
import { Game } from '../../types';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  game: Game;
  updateGame: (game: Game | undefined, keepPromptDisplay?: boolean) => void;
}

export const PromptContainer: React.FC<PromptContainerProps> = (props) => {
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    if (props.game.prompt && !displayPrompt) {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    }
  }, [props.game.prompt]);

  return displayPrompt && props.game.prompt ? (
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
  ) : undefined;
};
