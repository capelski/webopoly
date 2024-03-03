import React from 'react';
import { getPlayerById, PromptType } from '../../../../core';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const PlayerWinsPrompt: PromptInterface<PromptType.playerWins> = (props) => {
  const winningPlayer = getPlayerById(props.game, props.game.prompt.playerId);

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
