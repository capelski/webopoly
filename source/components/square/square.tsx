import React, { CSSProperties, useState } from 'react';
import {
  Neighborhood,
  PropertyStatus,
  PropertyType,
  SquareModalType,
  SquareType,
  TaxType,
} from '../../enums';
import { getCurrentPlayer, getPlayerById } from '../../logic';
import { currencySymbol, houseSymbol, mortgageSymbol, passGoMoney } from '../../parameters';
import { Game, Square } from '../../types';
import { PlayerAvatar } from '../common/player-avatar';
import { PlayersInSquare } from './players-in-square';
import { SquareMenuModal } from './square-menu-modal';
import { SquareOfferModal } from './square-offer-modal';
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
  const [squareModalType, setSquareModalType] = useState<SquareModalType | undefined>();

  const currentPlayer = getCurrentPlayer(props.game);
  const owner =
    props.square.type === SquareType.property && props.square.ownerId !== undefined
      ? getPlayerById(props.game, props.square.ownerId)
      : undefined;
  const playersInSquare = props.game.players.filter(
    (p) => p.squareId === props.square.id && !p.isInJail,
  );
  const playersInJail = props.game.players.filter(
    (p) => p.squareId === props.square.id && p.isInJail,
  );

  const { backgroundColor, color } =
    props.square.type === SquareType.property && props.square.propertyType === PropertyType.street
      ? streetsColorMap[props.square.neighborhood]
      : { backgroundColor: undefined, color: undefined };

  return (
    <div
      ref={props.rootRef}
      onClick={
        props.square.type === SquareType.property
          ? () => {
              setSquareModalType(SquareModalType.menu);
            }
          : undefined
      }
      style={{
        borderLeft: props.square.id === 1 ? '2px solid black' : undefined,
        borderRight: '2px solid black',
        display: 'flex',
        flexBasis: 180, // Sets the width, as parent has display: flex
        flexDirection: 'column',
        flexShrink: 0, // Sets the width, as parent has display: flex
        fontSize: 24,
      }}
    >
      {props.square.type === SquareType.property && squareModalType === SquareModalType.menu && (
        <SquareMenuModal
          game={props.game}
          setSquareModalType={setSquareModalType}
          square={props.square}
          updateGame={props.updateGame}
        />
      )}

      {props.square.type === SquareType.property &&
        squareModalType === SquareModalType.placeOffer && (
          <SquareOfferModal
            game={props.game}
            setSquareModalType={setSquareModalType}
            square={props.square}
            squareModalType={squareModalType}
            updateGame={props.updateGame}
          />
        )}

      <div
        style={{
          alignItems: 'center',
          backgroundColor,
          borderBottom: '1px solid black',
          borderTop: '2px solid black',
          color,
          display: 'flex',
          height: 50,
          justifyContent: 'center',
        }}
      >
        {props.square.name}
      </div>

      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {playersInSquare.length > 0 ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 50 }}>
              <PlayersInSquare
                currentPlayerId={currentPlayer.id}
                players={playersInSquare.filter((p) => !p.isInJail)}
              />
            </div>
            <div style={{ fontSize: 25 }}>
              <SquareTypeComponent square={props.square} />
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 72 }}>
            <SquareTypeComponent square={props.square} />
          </span>
        )}
      </div>

      <div
        style={{
          alignItems: 'center',
          backgroundColor: props.square.type === SquareType.jail ? '#ccc' : undefined,
          borderTop: props.square.type === SquareType.jail ? '1px solid black' : undefined,
          display: 'flex',
          fontSize: 20,
          justifyContent: 'center',
          height: 40,
          padding: '0 8px',
          textAlign: 'center',
        }}
      >
        {props.square.type === SquareType.go ? (
          <div>
            Collect {currencySymbol}
            {passGoMoney}
          </div>
        ) : undefined}

        {props.square.type === SquareType.tax ? (
          <div>
            Pay{' '}
            {props.square.taxType === TaxType.income
              ? `10% or ${currencySymbol}200`
              : `${currencySymbol}100`}
          </div>
        ) : undefined}

        {props.square.type === SquareType.jail ? (
          <div style={{ fontSize: 32 }}>
            <PlayersInSquare currentPlayerId={currentPlayer.id} players={playersInJail} />
          </div>
        ) : undefined}

        {props.square.type === SquareType.property && (
          <div style={{ flexGrow: 1 }}>
            {props.square.ownerId ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {currencySymbol}
                  {props.square.price}
                </div>
                <div>
                  <span style={{ paddingRight: 8 }}>
                    {owner && <PlayerAvatar player={owner} />}
                  </span>
                  {props.square.status === PropertyStatus.mortgaged ? (
                    <span>{mortgageSymbol}</span>
                  ) : props.square.propertyType === PropertyType.street ? (
                    <span>
                      {houseSymbol}&nbsp;{props.square.houses}
                    </span>
                  ) : undefined}
                </div>
              </div>
            ) : (
              <React.Fragment>
                {currencySymbol}
                {props.square.price}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
