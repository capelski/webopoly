import React from 'react';
import { GamePhase, PromptType } from '../../enums';
import { triggerBankruptcy } from '../../triggers';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const CannotPayPrompt: PromptInterface<PromptType.cannotPay> = (props) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Not enough money</h3>
      <div style={{ marginBottom: 16 }}></div>
      <div>
        <Button
          onClick={() => {
            props.updateGame({ ...props.game, status: GamePhase.cannotPay });
          }}
        >
          Sell/Mortgage properties
        </Button>
        <Button
          onClick={() => {
            props.updateGame(triggerBankruptcy(props.game, props.game.currentPlayerId));
          }}
        >
          Declare bankruptcy
        </Button>
      </div>
    </div>
  );
};
