import React from 'react';
import { Player } from '../../types';
import { Button } from '../common/button';

interface PlayerWinPromptProps {
  clearGameHandler: () => void;
  winningPlayer: Player;
}

export const PlayerWinPrompt: React.FC<PlayerWinPromptProps> = (props) => {
  return (
    <React.Fragment>
      <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {props.winningPlayer.name} wins the game
      </div>
      <div style={{ fontSize: 72, marginBottom: 32 }}>🏆🎉</div>
      <Button onClick={props.clearGameHandler}>Clear game</Button>
    </React.Fragment>
  );
};
