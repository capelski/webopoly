import { Game, GamePhase, getPlayerById } from '@webopoly/core';
import React from 'react';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const PlayerWinsPrompt: PromptInterface<Game<GamePhase.playerWins>> = (props) => {
  const winningPlayer = getPlayerById(props.game, props.game.phaseData.playerId);

  return (
    <React.Fragment>
      <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {winningPlayer.name} wins the game
      </div>
      <div style={{ fontSize: 72, marginBottom: 32 }}>🏆🎉</div>
      <Button
        onClick={() => {
          props.exitGame();
        }}
        type="delete"
      >
        Exit
      </Button>
    </React.Fragment>
  );
};
