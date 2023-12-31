import React, { CSSProperties, useState } from 'react';
import { notifyBuildHouse, notifyClearMortgage, notifyMortgage, notifySellHouse } from '../actions';
import {
  GamePhase,
  Neighborhood,
  PropertyStatus,
  PropertyType,
  SquareType,
  TaxType,
} from '../enums';
import {
  canBuildHouse,
  canClearMortgage,
  canMortgage,
  canSellHouse,
  getCurrentPlayer,
  getPlayerById,
  isPlayerInJail,
} from '../logic';
import { currencySymbol, houseSymbol, mortgageSymbol, passGoMoney } from '../parameters';
import { Game, Square } from '../types';
import { Button } from './button';
import { Modal } from './modal';
import { PlayerAvatar } from './player-avatar';
import { PlayersInSquare } from './players-in-square';
import { SquareTypeComponent } from './square-type';

interface SquareComponentProps {
  game: Game;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
  square: Square;
  updateGame: (game: Game) => void;
}

const streetsColorMap: { [group in Neighborhood]: CSSProperties } = {
  [Neighborhood.brown]: { backgroundColor: 'brown', color: 'white' },
  [Neighborhood.lightblue]: { backgroundColor: 'lightblue', color: 'black' },
  [Neighborhood.pink]: { backgroundColor: 'pink', color: 'black' },
  [Neighborhood.orange]: { backgroundColor: 'orange', color: 'white' },
  [Neighborhood.red]: { backgroundColor: 'red', color: 'white' },
  [Neighborhood.yellow]: { backgroundColor: 'yellow', color: 'black' },
  [Neighborhood.green]: { backgroundColor: 'green', color: 'white' },
  [Neighborhood.darkblue]: { backgroundColor: 'darkblue', color: 'white' },
};

export const SquareComponent: React.FC<SquareComponentProps> = (props) => {
  const [displayModal, setDisplayModal] = useState(false);

  const currentPlayer = getCurrentPlayer(props.game);
  const owner =
    props.square.type === SquareType.property && props.square.ownerId !== undefined
      ? getPlayerById(props.game, props.square.ownerId)
      : undefined;
  const playersInSquare = props.game.players.filter((p) => p.squareId === props.square.id);

  const { backgroundColor, color } =
    props.square.type === SquareType.property && props.square.propertyType === PropertyType.street
      ? streetsColorMap[props.square.neighborhood]
      : { backgroundColor: undefined, color: undefined };

  const fontStyle =
    props.square.type === SquareType.property && props.square.status === PropertyStatus.mortgaged
      ? 'italic'
      : undefined;

  return (
    <div
      ref={props.rootRef}
      onClick={
        props.square.type === SquareType.property
          ? () => {
              setDisplayModal(true);
            }
          : undefined
      }
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #ccc',
      }}
    >
      {displayModal && (
        <Modal>
          <div style={{ marginBottom: 16 }}>
            <Button
              disabled={
                props.game.gamePhase === GamePhase.rollDice ||
                props.square.type !== SquareType.property ||
                !canMortgage(props.square, currentPlayer.id)
              }
              onClick={() => {
                setDisplayModal(false);
                props.updateGame(notifyMortgage(props.game, props.square.id));
              }}
            >
              Mortgage
            </Button>

            <Button
              disabled={
                props.game.gamePhase === GamePhase.rollDice ||
                props.square.type !== SquareType.property ||
                !canClearMortgage(props.square, currentPlayer)
              }
              onClick={() => {
                setDisplayModal(false);
                props.updateGame(notifyClearMortgage(props.game, props.square.id));
              }}
            >
              Clear mortgage
            </Button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Button
              disabled={
                props.game.gamePhase === GamePhase.rollDice ||
                props.square.type !== SquareType.property ||
                !canBuildHouse(props.game, props.square, currentPlayer)
              }
              onClick={() => {
                setDisplayModal(false);
                props.updateGame(notifyBuildHouse(props.game, props.square.id));
              }}
            >
              Build house
            </Button>

            <Button
              disabled={
                props.game.gamePhase === GamePhase.rollDice ||
                props.square.type !== SquareType.property ||
                !canSellHouse(props.game, props.square, currentPlayer)
              }
              onClick={() => {
                setDisplayModal(false);
                props.updateGame(notifySellHouse(props.game, props.square.id));
              }}
            >
              Sell house
            </Button>
          </div>

          <Button
            onClick={() => {
              setDisplayModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal>
      )}

      <div
        style={{
          borderRight: '1px solid #ccc',
          fontSize: 22,
          width: '20%',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <PlayersInSquare
          currentPlayerId={currentPlayer.id}
          players={playersInSquare.filter((p) => !isPlayerInJail(p))}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor,
          color,
          fontStyle,
          fontSize: 24,
          width: props.square.type === SquareType.property ? '50%' : '80%',
          height: '100%',
          paddingLeft: 4,
        }}
      >
        <SquareTypeComponent square={props.square} />
        {props.square.name}
        {props.square.type === SquareType.go ? (
          <div
            style={{
              fontSize: 18,
              flexGrow: 1,
              textAlign: 'right',
              paddingRight: 4,
            }}
          >
            Collect {currencySymbol}
            {passGoMoney}
          </div>
        ) : props.square.type === SquareType.tax ? (
          <div
            style={{
              fontSize: 18,
              flexGrow: 1,
              textAlign: 'right',
              paddingRight: 4,
            }}
          >
            {props.square.taxType === TaxType.income
              ? `10% or ${currencySymbol}200`
              : `${currencySymbol}100`}
          </div>
        ) : props.square.type === SquareType.jail ? (
          <div
            style={{
              paddingLeft: 8,
            }}
          >
            <PlayersInSquare
              currentPlayerId={currentPlayer.id}
              players={playersInSquare.filter(isPlayerInJail)}
            />
          </div>
        ) : undefined}
      </div>

      {props.square.type === SquareType.property && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontStyle,
            justifyContent: 'flex-end',
            backgroundColor,
            color,
            fontSize: 18,
            width: '30%',
            height: '100%',
            paddingRight: 4,
          }}
        >
          {props.square.status === PropertyStatus.mortgaged ? (
            mortgageSymbol
          ) : (
            <React.Fragment>
              {owner && <PlayerAvatar player={owner} />}
              {props.square.propertyType === PropertyType.street && (
                <span>
                  {houseSymbol}&nbsp;{props.square.houses || 0}&nbsp;
                </span>
              )}
              {currencySymbol}
              {props.square.price}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};
