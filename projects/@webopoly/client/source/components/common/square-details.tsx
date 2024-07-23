import {
  currencySymbol,
  Game,
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
  houseRents,
  ownsNeighborhood,
  PropertySquare,
  PropertyStatus,
  PropertyType,
  stationRents,
} from '@webopoly/core';
import React from 'react';
import {
  clearMortgageSymbol,
  houseSymbol,
  mortgageSymbol,
  sellHouseSymbol,
  stationSymbol,
} from '../../parameters';
import { Paragraph } from './paragraph';
import { PlayerAvatar } from './player-avatar';
import { SquareTitle } from './square-title';

interface SquareDetailsProps {
  game: Game;
  square: PropertySquare;
}

export const SquareDetails: React.FC<SquareDetailsProps> = (props) => {
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
        minHeight: 310,
        width: 250,
      }}
    >
      <SquareTitle game={props.game} square={props.square} />

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
            <Paragraph
              style={{
                display: 'flex',
                fontWeight: owner && !props.square.houses && !hasNeighborhood ? 'bold' : undefined,
                justifyContent: 'space-between',
              }}
              type="small"
            >
              <span>Single rent</span>
              <span>
                {currencySymbol}
                {getStreetRent(props.square.price)}
              </span>
            </Paragraph>

            <Paragraph
              style={{
                display: 'flex',
                fontWeight: !props.square.houses && hasNeighborhood ? 'bold' : undefined,
                justifyContent: 'space-between',
              }}
              type="small"
            >
              <span>Color set rent</span>
              <span>
                {currencySymbol}
                {getStreetRent(props.square.price, { ownsNeighborhood: true })}
              </span>
            </Paragraph>

            {Object.keys(houseRents).map((housesNumberKey, index) => {
              const housesNumber = parseInt(housesNumberKey);

              return (
                <Paragraph
                  key={index}
                  style={{
                    display: 'flex',
                    fontWeight:
                      props.square.propertyType === PropertyType.street &&
                      props.square.houses === housesNumber
                        ? 'bold'
                        : undefined,
                    justifyContent: 'space-between',
                  }}
                  type="small"
                >
                  <span>
                    {housesNumber} {houseSymbol} rent
                  </span>
                  <span>
                    {currencySymbol}
                    {getStreetRent(props.square.price, { housesNumber })}
                  </span>
                </Paragraph>
              );
            })}
          </React.Fragment>
        ) : props.square.propertyType === PropertyType.station ? (
          <React.Fragment>
            {Object.keys(stationRents).map((stationsNumberKey, index) => {
              const stationsNumber = parseInt(stationsNumberKey);
              return (
                <Paragraph
                  key={index}
                  style={{
                    display: 'flex',
                    fontWeight: stationsNumber === ownerStations ? 'bold' : undefined,
                    justifyContent: 'space-between',
                  }}
                  type="small"
                >
                  <span>
                    {stationsNumber} {stationSymbol} rent
                  </span>
                  <span>
                    {currencySymbol}
                    {getStationRent(stationsNumber)}
                  </span>
                </Paragraph>
              );
            })}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Paragraph
              style={{ fontWeight: ownerUtilities === 1 ? 'bold' : undefined, padding: '4px 0' }}
              type="small"
            >
              If one Utility is owned, the rent is {getUtilityRentMultiplier(1)} times the last dice
              roll.
            </Paragraph>
            <Paragraph
              style={{ fontWeight: ownerUtilities === 2 ? 'bold' : undefined, padding: '4px 0' }}
              type="small"
            >
              If both Utilities are owned, the rent is {getUtilityRentMultiplier(2)} times the last
              dice roll.
            </Paragraph>
          </React.Fragment>
        )}
      </div>

      <div
        style={{
          padding: 4,
        }}
      >
        {props.square.propertyType === PropertyType.street && (
          <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }} type="small">
            <span>Houses</span>
            <span>
              {houseSymbol} {currencySymbol}
              {getBuildHouseAmount(props.square)} / {sellHouseSymbol} {currencySymbol}
              {getSellHouseAmount(props.square)}
            </span>
          </Paragraph>
        )}
        <Paragraph style={{ display: 'flex', justifyContent: 'space-between' }} type="small">
          <span>Mortgage</span>
          <span>
            {mortgageSymbol} {currencySymbol}
            {getMortgageAmount(props.square)} / {clearMortgageSymbol} {currencySymbol}
            {getClearMortgageAmount(props.square)}
          </span>
        </Paragraph>
      </div>
    </div>
  );
};
