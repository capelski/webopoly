import React from 'react';
import {
  GamePhase,
  PropertyStatus,
  PropertyType,
  SquareModalType,
  SquareType,
} from '../../../enums';
import {
  canBuildHouse,
  canClearMortgage,
  canMortgage,
  canSellHouse,
  getBuildHouseAmount,
  getClearMortgageAmount,
  getCurrentPlayer,
  getMortgageAmount,
  getPlayerById,
  getSellHouseAmount,
} from '../../../logic';
import {
  buyOfferSymbol,
  clearMortgageSymbol,
  currencySymbol,
  houseRents,
  houseSymbol,
  mortgageSymbol,
  rentPercentage,
  sellHouseSymbol,
  sellOfferSymbol,
  stationRents,
  stationSymbol,
} from '../../../parameters';
import {
  triggerBuildHouse,
  triggerClearMortgage,
  triggerMortgage,
  triggerSellHouse,
} from '../../../triggers';
import { Game, PropertySquare } from '../../../types';
import { Button } from '../../common/button';
import { Modal } from '../../common/modal';
import { PlayerAvatar } from '../../common/player-avatar';
import { SquareIcon } from './square-icon';
import { streetsColorMap } from './street-colors-map';

// TODO Extract multiplication and rounding for rent prices

interface SquareDetailsModalProps {
  game: Game;
  setSquareModalType: (squareModalType: SquareModalType | undefined) => void;
  square: PropertySquare;
  updateGame: (game: Game) => void;
}

export const SquareDetailsModal: React.FC<SquareDetailsModalProps> = (props) => {
  const currentPlayer = getCurrentPlayer(props.game);

  const { backgroundColor, color } =
    props.square.type === SquareType.property
      ? props.square.status === PropertyStatus.mortgaged
        ? { backgroundColor: 'lightgrey', color: 'white' }
        : props.square.propertyType === PropertyType.street
        ? streetsColorMap[props.square.neighborhood]
        : { backgroundColor: undefined, color: undefined }
      : { backgroundColor: undefined, color: undefined };

  const owner = props.square.ownerId && getPlayerById(props.game, props.square.ownerId);

  return (
    <Modal
      closeHandler={() => {
        props.setSquareModalType(undefined);
      }}
      inset="10% 20px"
    >
      <div
        style={{
          border: `2px solid #aaa`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 300,
          width: 250,
        }}
      >
        <div
          style={{
            alignItems: 'center',
            backgroundColor,
            borderBottom: `2px solid #aaa`,
            color,
            display: 'flex',
            flexDirection: 'column',
            fontSize: 24,
            justifyContent: 'center',
            padding: 8,
          }}
        >
          {props.square.propertyType !== PropertyType.street && (
            <div style={{ fontSize: 40 }}>
              <SquareIcon square={props.square} />
            </div>
          )}
          <div>{props.square.name}</div>
        </div>

        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-around',
            fontSize: 20,
            padding: 4,
            borderBottom: '1px solid #aaa',
          }}
        >
          <span>
            {currencySymbol}
            {props.square.price}
          </span>
          {owner && (
            <React.Fragment>
              <span>
                <PlayerAvatar player={owner} />
              </span>
              {props.square.propertyType === PropertyType.street &&
              props.square.status !== PropertyStatus.mortgaged ? (
                <span>
                  {houseSymbol}&nbsp;{props.square.houses}
                </span>
              ) : undefined}
            </React.Fragment>
          )}
        </div>

        <div
          style={{
            borderBottom: '1px solid #aaa',
            flexGrow: 1,
            padding: 4,
          }}
        >
          {props.square.propertyType === PropertyType.street ? (
            <React.Fragment>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rent</span>
                <span>
                  {currencySymbol}
                  {rentPercentage * props.square.price}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rent with color set</span>
                <span>
                  {currencySymbol}
                  {2 * rentPercentage * props.square.price}
                </span>
              </div>
              {Object.keys(houseRents).map((houseNumber, index) => {
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      Rent with {houseNumber} {houseSymbol}
                    </span>
                    <span>
                      {currencySymbol}
                      {houseRents[parseInt(houseNumber)] * props.square.price}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          ) : props.square.propertyType === PropertyType.station ? (
            <React.Fragment>
              {Object.keys(stationRents).map((stationsNumber, index) => {
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      Rent with {stationsNumber} {stationSymbol}
                    </span>
                    <span>
                      {currencySymbol}
                      {stationRents[parseInt(stationsNumber)]}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>If one Utility is owned, the rent is 4 times the last dice roll.</p>
              <p>If both Utilities are owned, the rent is 10 times the last dice roll.</p>
            </React.Fragment>
          )}
        </div>

        <div
          style={{
            padding: 4,
          }}
        >
          {props.square.propertyType === PropertyType.street && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Houses</span>
              <span>
                {houseSymbol} {currencySymbol}
                {getBuildHouseAmount(props.square)} / {sellHouseSymbol} {currencySymbol}
                {getSellHouseAmount(props.square)}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Mortgage</span>
            <span>
              {mortgageSymbol} {currencySymbol}
              {getMortgageAmount(props.square)} / {clearMortgageSymbol} {currencySymbol}
              {getClearMortgageAmount(props.square)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            disabled={!canMortgage(props.square, currentPlayer.id)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.updateGame(triggerMortgage(props.game, props.square.id));
            }}
          >
            {mortgageSymbol} Mortgage
          </Button>

          <Button
            disabled={!canClearMortgage(props.square, currentPlayer)}
            onClick={() => {
              props.setSquareModalType(undefined);
              props.updateGame(triggerClearMortgage(props.game, props.square.id));
            }}
          >
            {clearMortgageSymbol} Clear mortgage
          </Button>
        </div>

        {props.square.propertyType === PropertyType.street && (
          <div style={{ marginBottom: 16 }}>
            <Button
              disabled={!canBuildHouse(props.game, props.square, currentPlayer)}
              onClick={() => {
                props.setSquareModalType(undefined);
                props.updateGame(triggerBuildHouse(props.game, props.square.id));
              }}
            >
              {houseSymbol} Build house
            </Button>

            <Button
              disabled={!canSellHouse(props.game, props.square, currentPlayer)}
              onClick={() => {
                props.setSquareModalType(undefined);
                props.updateGame(triggerSellHouse(props.game, props.square.id));
              }}
            >
              {sellHouseSymbol} Sell house
            </Button>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <Button
            disabled={
              props.game.phase === GamePhase.prompt ||
              !props.square.ownerId ||
              (props.square.propertyType === PropertyType.street && props.square.houses > 0) ||
              props.game.currentPlayerId === props.square.ownerId
            }
            onClick={() => {
              props.setSquareModalType(SquareModalType.placeOffer);
            }}
          >
            {buyOfferSymbol} Buy offer
          </Button>

          <Button
            disabled={
              props.game.phase === GamePhase.prompt ||
              !props.square.ownerId ||
              (props.square.propertyType === PropertyType.street && props.square.houses > 0) ||
              props.game.currentPlayerId !== props.square.ownerId
            }
            onClick={() => {
              props.setSquareModalType(SquareModalType.placeOffer);
            }}
          >
            {sellOfferSymbol} Sell offer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
