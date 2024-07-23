import {
  currencySymbol,
  Game,
  passGoMoney,
  Square,
  SquareModalType,
  SquareType,
  TaxType,
} from '@webopoly/core';
import React from 'react';
import { Modal } from '../../common/modal';
import { Paragraph } from '../../common/paragraph';
import { Title } from '../../common/title';
import { SquareIcon } from './square-icon';

interface OtherSquareDetailsModalProps {
  game: Game;
  setSquareModalType: (squareModalType: SquareModalType | undefined) => void;
  square: Square;
}

export const OtherSquareDetailsModal: React.FC<OtherSquareDetailsModalProps> = (props) => {
  return (
    <Modal
      closeHandler={() => {
        props.setSquareModalType(undefined);
      }}
    >
      {props.square.type === SquareType.jail ? (
        <Title>Jail</Title>
      ) : props.square.type === SquareType.parking ? (
        <Title>Free parking</Title>
      ) : props.square.type === SquareType.surprise ? (
        <Title>Surprise card</Title>
      ) : props.square.type === SquareType.tax ? (
        props.square.taxType === TaxType.income ? (
          <Title>Income Tax</Title>
        ) : (
          <Title>Luxury Tax</Title>
        )
      ) : undefined}

      <div style={{ fontSize: 52 }}>
        <SquareIcon square={props.square} />
      </div>

      {props.square.type === SquareType.go ? (
        <Paragraph>
          Collect {currencySymbol}
          {passGoMoney} salary every time you pass
        </Paragraph>
      ) : props.square.type === SquareType.goToJail ? (
        <Paragraph>Go to Jail</Paragraph>
      ) : props.square.type === SquareType.parking ? (
        <Paragraph>
          {currencySymbol}
          {props.game.centerPot}
        </Paragraph>
      ) : props.square.type === SquareType.tax ? (
        props.square.taxType === TaxType.income ? (
          <Paragraph>Pay {currencySymbol}200</Paragraph>
        ) : (
          <Paragraph>Pay {currencySymbol}100</Paragraph>
        )
      ) : undefined}
    </Modal>
  );
};
