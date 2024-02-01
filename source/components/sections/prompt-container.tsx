import React, { useEffect, useState } from 'react';
import { GamePhaseName } from '../../enums';
import { Game } from '../../types';
import { PromptComponent } from '../prompts/prompt';

interface PromptContainerProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

export const PromptContainer: React.FC<PromptContainerProps> = (props) => {
  const [displayPrompt, setDisplayPrompt] = useState(false);

  useEffect(() => {
    if (!displayPrompt && props.game.phase.name === GamePhaseName.prompt) {
      setTimeout(() => {
        setDisplayPrompt(true);
      }, 800);
    }
  }, [props.game.phase]);

  return displayPrompt && props.game.phase.name === GamePhaseName.prompt ? (
    <PromptComponent
      game={props.game}
      prompt={props.game.phase.prompt}
      updateGame={(game) => {
        setDisplayPrompt(false);
        return props.updateGame(game);
      }}
    />
  ) : undefined;
};
