import React from 'react';
import { PromptType } from '../../enums';
import { getPlayerById } from '../../logic';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const PlayerWinsPrompt: PromptInterface<PromptType.playerWins> = (props) => {
  const winningPlayer = getPlayerById(props.game, props.prompt.playerId);

  return (
    <React.Fragment>
      <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {winningPlayer.name} wins the game
      </div>
      <div style={{ fontSize: 72, marginBottom: 32 }}>🏆🎉</div>
      <Button
        onClick={() => {
          props.updateGame(undefined);
        }}
      >
        Clear game
      </Button>
    </React.Fragment>
  );
};
