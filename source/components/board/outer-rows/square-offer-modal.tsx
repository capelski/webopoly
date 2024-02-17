import React, { useState } from 'react';
import { GamePhase, SquareModalType } from '../../../enums';
import { getCurrentPlayer, getOtherPlayers, getPlayerById } from '../../../logic';
import { currencySymbol } from '../../../parameters';
import { triggerBuyingOffer, triggerSellingOffer } from '../../../triggers';
import { Game, Id, PropertySquare } from '../../../types';
import { Button } from '../../common/button';
import { Modal } from '../../common/modal';

interface SquareOfferModalProps {
  game: Game;
  setSquareModalType: (squareModalType: undefined) => void;
  square: PropertySquare;
  squareModalType: SquareModalType.buyOffer | SquareModalType.sellOffer;
  updateGame: (game: Game) => void;
}

export const SquareOfferModal: React.FC<SquareOfferModalProps> = (props) => {
  const [offer, setOffer] = useState(0);
  const [targetPlayerId, setTargetPlayerId] = useState<Id | undefined>(undefined);

  const isSellOffer = props.squareModalType === SquareModalType.sellOffer;
  const currentPlayer = getCurrentPlayer(props.game);
  const otherPlayers = getOtherPlayers(props.game, currentPlayer.id);
  const targetPlayer = !!targetPlayerId && getPlayerById(props.game, targetPlayerId);

  const maxAmount = isSellOffer
    ? targetPlayer
      ? targetPlayer.money
      : undefined
    : currentPlayer.money;

  return (
    <Modal
      closeHandler={() => {
        props.setSquareModalType(undefined);
      }}
    >
      {isSellOffer && (
        <div style={{ marginBottom: 16 }}>
          {otherPlayers.map((p) => (
            <div key={p.id}>
              <input
                checked={targetPlayerId === p.id}
                onChange={(event) => {
                  setTargetPlayerId(parseInt(event.target.value));
                }}
                name="targetPlayerId"
                type="radio"
                value={p.id}
              />
              <label htmlFor="regular">{p.name}</label>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        {currencySymbol}
        <input
          disabled={isSellOffer && !targetPlayerId}
          onChange={(event) => {
            const parsedValue = Math.round(parseInt(event.target.value)) || 0;
            setOffer(Math.min(parsedValue, maxAmount!));
          }}
          type="number"
          max={maxAmount}
          min={0}
          value={offer || ''}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button
          disabled={offer <= 0 || (isSellOffer && !targetPlayerId)}
          onClick={() => {
            if (props.game.phase !== GamePhase.prompt) {
              props.setSquareModalType(undefined);
              props.updateGame(
                isSellOffer
                  ? triggerSellingOffer(props.game, props.square, offer, targetPlayerId!)
                  : triggerBuyingOffer(props.game, props.square, offer),
              );
            }
          }}
        >
          Send offer
        </Button>
      </div>
    </Modal>
  );
};
