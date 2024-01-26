import React, { useState } from 'react';
import { SquareModalType } from '../../enums';
import { getCurrentPlayer, getOtherPlayers } from '../../logic';
import { currencySymbol } from '../../parameters';
import { triggerBuyingOffer, triggerSellingOffer } from '../../triggers';
import { Game, Id, PropertySquare } from '../../types';
import { Button } from '../common/button';
import { Modal } from '../common/modal';

interface SquareOfferModalProps {
  game: Game;
  setSquareModalType: (squareModalType: SquareModalType | undefined) => void;
  square: PropertySquare;
  squareModalType: SquareModalType;
  updateGame: (game: Game) => void;
}

export const SquareOfferModal: React.FC<SquareOfferModalProps> = (props) => {
  const [offer, setOffer] = useState(0);
  const [targetPlayerId, setTargetPlayerId] = useState<Id | undefined>(undefined);

  const currentPlayer = getCurrentPlayer(props.game);
  const otherPlayers = getOtherPlayers(props.game, currentPlayer.id);
  const isSellingOffer = props.game.currentPlayerId === props.square.ownerId;

  return (
    <Modal>
      <div style={{ marginBottom: 16 }}>
        {currencySymbol}
        <input
          onChange={(event) => {
            const parsedValue = Math.round(parseInt(event.target.value)) || 0;
            setOffer(Math.min(parsedValue, currentPlayer.money));
          }}
          type="number"
          max={isSellingOffer ? undefined : currentPlayer.money}
          min={0}
          value={offer || ''}
        />
      </div>

      {isSellingOffer && (
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
        <Button
          disabled={offer <= 0 || (isSellingOffer && !targetPlayerId)}
          onClick={() => {
            props.setSquareModalType(undefined);
            props.updateGame(
              isSellingOffer
                ? triggerSellingOffer(props.game, props.square, offer, targetPlayerId!)
                : triggerBuyingOffer(props.game, props.square, offer),
            );
          }}
        >
          Send offer
        </Button>
      </div>

      <Button
        onClick={() => {
          props.setSquareModalType(undefined);
        }}
      >
        Cancel
      </Button>
    </Modal>
  );
};
