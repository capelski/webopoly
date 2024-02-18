import React from 'react';
import { PromptType } from '../../enums';
import { getCurrentPlayer, getPendingAmount } from '../../logic';
import { currencySymbol } from '../../parameters';
import { triggerBankruptcy, triggerPendingPaymentLiquidation } from '../../triggers';
import { Button } from '../common/button';
import { PromptInterface } from './prompt-interface';

export const CannotPayPrompt: PromptInterface<PromptType.cannotPay> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Not enough money</h3>
      <p>
        You owe {currencySymbol}
        {getPendingAmount(props.game)}
      </p>
      <div style={{ marginBottom: 16 }}></div>
      <div>
        <Button
          onClick={() => {
            props.updateGame(triggerPendingPaymentLiquidation(props.game));
          }}
        >
          Liquidate properties
        </Button>
        <Button
          onClick={() => {
            props.updateGame(triggerBankruptcy(props.game, currentPlayer.id));
          }}
        >
          Declare bankruptcy
        </Button>
      </div>
    </div>
  );
};
