import {
  canDeclareBankruptcy,
  canLiquidatePendingPayment,
  currencySymbol,
  Game,
  GamePhase,
  GameUpdateType,
  getPendingAmount,
} from '@webopoly/core';
import React from 'react';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const CannotPayPrompt: PromptInterface<Game<GamePhase.cannotPay>> = (props) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Title>Not enough money</Title>
      <Paragraph>
        You owe {currencySymbol}
        {getPendingAmount(props.game)}
      </Paragraph>
      <div style={{ marginBottom: 16 }}></div>
      <div>
        <Button
          disabled={!canLiquidatePendingPayment(props.game, props.windowPlayerId)}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.paymentLiquidation });
          }}
        >
          Liquidate properties
        </Button>
        <Button
          autoClick={GameUpdateType.bankruptcy}
          defaultAction={props.game.defaultAction}
          disabled={!canDeclareBankruptcy(props.game, props.windowPlayerId)}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.bankruptcy });
          }}
        >
          Declare bankruptcy
        </Button>
      </div>
    </div>
  );
};
