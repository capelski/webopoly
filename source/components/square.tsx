import React, { CSSProperties, useState } from 'react';
import { Neighborhood, PropertyStatus, PropertyType, SquareType, TaxType } from '../enums';
import { getCurrentPlayer, getPlayerById, isPlayerInJail } from '../logic';
import { currencySymbol, houseSymbol, mortgageSymbol, passGoMoney } from '../parameters';
import { Game, Square } from '../types';
import { PlayerAvatar } from './player-avatar';
import { PlayersInSquare } from './players-in-square';
import { SquareModal, SquareOptionsModal } from './square-options-modal';
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
  const [squareModal, setSquareModal] = useState<SquareModal>('none');

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
              setSquareModal('options');
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
      {props.square.type === SquareType.property && squareModal === 'options' && (
        <SquareOptionsModal
          game={props.game}
          setSquareModal={setSquareModal}
          square={props.square}
          squareModal={squareModal}
          updateGame={props.updateGame}
        />
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
                  {houseSymbol}&nbsp;{props.square.houses}&nbsp;
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
