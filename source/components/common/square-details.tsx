import React from 'react';
import { PropertyStatus, PropertyType, SquareType } from '../../enums';
import {
  getBuildHouseAmount,
  getClearMortgageAmount,
  getMortgageAmount,
  getPlayerActiveStations,
  getPlayerActiveUtilities,
  getPlayerById,
  getSellHouseAmount,
  getStationRent,
  getStreetRent,
  getUtilityRentMultiplier,
  ownsNeighborhood,
} from '../../logic';
import {
  clearMortgageSymbol,
  currencySymbol,
  houseRents,
  houseSymbol,
  mortgageSymbol,
  sellHouseSymbol,
  stationRents,
  stationSymbol,
} from '../../parameters';
import { Game, PropertySquare } from '../../types';
import { SquareIcon } from '../board/outer-rows/square-icon';
import { streetsColorMap } from '../board/outer-rows/street-colors-map';
import { PlayerAvatar } from './player-avatar';

interface SquareDetailsProps {
  game: Game;
  square: PropertySquare;
}

const getRentBorder = (isActive: number | boolean | undefined) => {
  return `2px solid ${isActive ? 'goldenrod' : 'white'}`;
};

export const SquareDetails: React.FC<SquareDetailsProps> = (props) => {
  const { backgroundColor, color } =
    props.square.type === SquareType.property
      ? props.square.status === PropertyStatus.mortgaged
        ? { backgroundColor: 'lightgrey', color: 'white' }
        : props.square.propertyType === PropertyType.street
        ? streetsColorMap[props.square.neighborhood]
        : { backgroundColor: undefined, color: undefined }
      : { backgroundColor: undefined, color: undefined };

  const owner = props.square.ownerId && getPlayerById(props.game, props.square.ownerId);
  const ownerStations = owner && getPlayerActiveStations(props.game, owner.id).length;
  const ownerUtilities = owner && getPlayerActiveUtilities(props.game, owner.id).length;
  const hasNeighborhood =
    owner &&
    props.square.propertyType === PropertyType.street &&
    ownsNeighborhood(props.game, props.square);

  return (
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
            <div
              style={{
                border: getRentBorder(owner && !props.square.houses && !hasNeighborhood),
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 2px',
              }}
            >
              <span>Rent</span>
              <span>
                {currencySymbol}
                {getStreetRent(props.square.price)}
              </span>
            </div>
            <div
              style={{
                border: getRentBorder(!props.square.houses && hasNeighborhood),
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 2px',
              }}
            >
              <span>Rent with color set</span>
              <span>
                {currencySymbol}
                {getStreetRent(props.square.price, { ownsNeighborhood: true })}
              </span>
            </div>
            {Object.keys(houseRents).map((housesNumberKey, index) => {
              const housesNumber = parseInt(housesNumberKey);

              return (
                <div
                  key={index}
                  style={{
                    border: getRentBorder(
                      props.square.propertyType === PropertyType.street &&
                        props.square.houses === housesNumber,
                    ),
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 2px',
                  }}
                >
                  <span>
                    Rent with {housesNumber} {houseSymbol}
                  </span>
                  <span>
                    {currencySymbol}
                    {getStreetRent(props.square.price, { housesNumber })}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ) : props.square.propertyType === PropertyType.station ? (
          <React.Fragment>
            {Object.keys(stationRents).map((stationsNumberKey, index) => {
              const stationsNumber = parseInt(stationsNumberKey);
              return (
                <div
                  key={index}
                  style={{
                    border: getRentBorder(stationsNumber === ownerStations),
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 2px',
                  }}
                >
                  <span>
                    Rent with {stationsNumber} {stationSymbol}
                  </span>
                  <span>
                    {currencySymbol}
                    {getStationRent(stationsNumber)}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p style={{ border: getRentBorder(ownerUtilities === 1), padding: '0 2px' }}>
              If one Utility is owned, the rent is {getUtilityRentMultiplier(1)} times the last dice
              roll.
            </p>
            <p style={{ border: getRentBorder(ownerUtilities === 2), padding: '0 2px' }}>
              If both Utilities are owned, the rent is {getUtilityRentMultiplier(2)} times the last
              dice roll.
            </p>
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
  );
};
