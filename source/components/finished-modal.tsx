import React from 'react';
import { PlayerStatus } from '../enums';
import { Game } from '../types';
import { Button } from './button';
import { Modal } from './modal';

interface FinishedModalProps {
  clearGame: () => void;
  game: Game;
}

export const FinishedModal: React.FC<FinishedModalProps> = (props) => {
  return (
    <Modal>
      <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {props.game.players.find((p) => p.status === PlayerStatus.playing)!.name} wins the game
      </div>
      <div style={{ fontSize: 72, marginBottom: 32 }}>🏆🎉</div>
      <Button
        onClick={() => {
          props.clearGame();
        }}
      >
        Clear game
      </Button>
    </Modal>
  );
};
