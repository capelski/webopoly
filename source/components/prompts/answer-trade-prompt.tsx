import React from 'react';
import { PromptType } from '../../enums';
import { getPlayerById, getSquareById } from '../../logic';
import { triggerAcceptTrade, triggerDeclineTrade } from '../../triggers';
import { PropertySquare } from '../../types';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { SquareTitle } from '../common/square-title';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const AnswerTradePrompt: PromptInterface<PromptType.answerTrade> = (props) => {
  const initiatorPlayer = getPlayerById(props.game, props.game.prompt.playerId);
  const initiatorProperties = props.game.prompt.playerPropertiesId.map((pId) =>
    getSquareById(props.game, pId),
  ) as PropertySquare[];
  const targetPlayer = getPlayerById(props.game, props.game.prompt.targetPlayerId);
  const targetProperties = props.game.prompt.targetPropertiesId.map((pId) =>
    getSquareById(props.game, pId),
  ) as PropertySquare[];

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>{targetPlayer.name}</Title>
      <Paragraph>{initiatorPlayer.name} is offering</Paragraph>
      {initiatorProperties.map((square) => {
        return <SquareTitle game={props.game} mode="trade" square={square} />;
      })}
      <Paragraph>for</Paragraph>
      {targetProperties.map((square) => {
        return <SquareTitle game={props.game} mode="trade" square={square} />;
      })}
      <div style={{ marginTop: 24 }}>
        <Button
          onClick={() => {
            props.updateGame(triggerAcceptTrade(props.game));
          }}
        >
          Accept
        </Button>
        <Button
          onClick={() => {
            props.updateGame(triggerDeclineTrade(props.game));
          }}
          type="delete"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
