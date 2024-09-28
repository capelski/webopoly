import {
  canTriggerBuyingOffer,
  canTriggerSellingOffer,
  currencySymbol,
  Game,
  GameUpdate,
  GameUpdateType,
  getCurrentPlayer,
  getOtherPlayers,
  getPlayerById,
  Player,
  PropertySquare,
  SquareModalType,
} from '@webopoly/core';
import React, { useState } from 'react';
import { Button } from '../../common/button';
import { Input } from '../../common/input';
import { Modal } from '../../common/modal';
import { Paragraph } from '../../common/paragraph';

interface SquareOfferModalProps {
  game: Game<any>;
  setSquareModalType: (squareModalType: undefined) => void;
  square: PropertySquare;
  squareModalType: SquareModalType.buyOffer | SquareModalType.sellOffer;
  triggerUpdate: (gameUpdate: GameUpdate) => void;
  windowPlayerId: Player['id'];
}

export const SquareOfferModal: React.FC<SquareOfferModalProps> = (props) => {
  const isSellOffer = props.squareModalType === SquareModalType.sellOffer;
  const currentPlayer = getCurrentPlayer(props.game);
  const otherPlayers = getOtherPlayers(props.game, currentPlayer.id);

  const [offer, setOffer] = useState(0);
  const [targetPlayerId, setTargetPlayerId] = useState<Player['id'] | undefined>(
    otherPlayers.length === 1 ? otherPlayers[0].id : undefined,
  );

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
            <Paragraph key={p.id}>
              <Input
                checked={targetPlayerId === p.id}
                onChange={(event) => {
                  setTargetPlayerId(event.target.value);
                }}
                name="targetPlayerId"
                type="radio"
                value={p.id}
              />
              <label htmlFor="targetPlayerId">{p.name}</label>
            </Paragraph>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        {currencySymbol}
        <Input
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
          disabled={
            !(isSellOffer
              ? canTriggerSellingOffer(
                  props.game,
                  props.square.id,
                  offer,
                  targetPlayerId,
                  props.windowPlayerId,
                )
              : canTriggerBuyingOffer(props.game, props.square.id, offer, props.windowPlayerId))
          }
          onClick={() => {
            props.setSquareModalType(undefined);
            props.triggerUpdate(
              isSellOffer
                ? {
                    type: GameUpdateType.sellingOffer,
                    amount: offer,
                    squareId: props.square.id,
                    targetPlayerId: targetPlayerId!,
                  }
                : { type: GameUpdateType.buyingOffer, amount: offer, squareId: props.square.id },
            );
          }}
        >
          Send offer
        </Button>
      </div>
    </Modal>
  );
};
