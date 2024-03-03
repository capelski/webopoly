import React, { CSSProperties } from 'react';
import { Game, PropertySquare, PropertyStatus, PropertyType, SquareType } from '../../../../core';
import { SquareIcon } from '../board/outer-rows/square-icon';
import { streetsColorMap } from '../board/outer-rows/street-colors-map';
import { Title } from './title';

interface SquareTitleProps {
  game: Game;
  mode?: 'details' | 'trade';
  square: PropertySquare;
}

export const SquareTitle: React.FC<SquareTitleProps> = (props) => {
  const { backgroundColor, color } =
    props.square.type === SquareType.property
      ? props.square.status === PropertyStatus.mortgaged
        ? { backgroundColor: 'lightgrey', color: 'white' }
        : props.square.propertyType === PropertyType.street
        ? streetsColorMap[props.square.neighborhood]
        : { backgroundColor: undefined, color: undefined }
      : { backgroundColor: undefined, color: undefined };

  const styles: CSSProperties = {
    alignItems: 'center',
    backgroundColor,
    color,
    display: 'flex',
    flexDirection: props.mode === 'trade' ? 'row' : 'column',
    justifyContent: 'center',
    marginBottom: props.mode === 'trade' ? 8 : undefined,
    padding: 8,
  };

  if (props.mode === 'trade') {
    styles.border = `2px solid #aaa`;
  } else {
    styles.borderBottom = `2px solid #aaa`;
  }

  return (
    <div style={styles}>
      {props.square.propertyType !== PropertyType.street && (
        <div
          style={{
            fontSize: props.mode === 'trade' ? undefined : 40,
            paddingRight: props.mode === 'trade' ? 8 : undefined,
          }}
        >
          <SquareIcon square={props.square} />
        </div>
      )}
      <Title type="small">{props.square.name}</Title>
    </div>
  );
};
