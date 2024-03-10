import React, { useState } from 'react';
import {
  currencySymbol,
  Game,
  GamePhase,
  getCurrentPlayer,
  getOtherPlayers,
  getPlayerById,
  Player,
  PropertySquare,
  SquareModalType,
  triggerBuyingOffer,
  triggerSellingOffer,
} from '../../../../../core';
import { Button } from '../../common/button';
import { Input } from '../../common/input';
import { Modal } from '../../common/modal';
import { Paragraph } from '../../common/paragraph';

interface SquareOfferModalProps {
  game: Game;
  setSquareModalType: (squareModalType: undefined) => void;
  square: PropertySquare;
  squareModalType: SquareModalType.buyOffer | SquareModalType.sellOffer;
  updateGame: (game: Game) => void;
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
          disabled={offer <= 0 || (isSellOffer && !targetPlayerId)}
          onClick={() => {
            if (props.game.phase !== GamePhase.prompt && props.game.phase !== GamePhase.trade) {
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
