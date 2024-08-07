import {
  canAnswerTrade,
  GameUpdateType,
  getPlayerById,
  getSquareById,
  PromptType,
  PropertySquare,
} from '@webopoly/core';
import React from 'react';
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
  const canAnswer = canAnswerTrade(props.game, props.windowPlayerId);

  return (
    <div style={{ textAlign: 'center' }}>
      <Title>{targetPlayer.name}</Title>
      <Paragraph>{initiatorPlayer.name} is offering</Paragraph>
      {initiatorProperties.map((square) => {
        return <SquareTitle game={props.game} key={square.id} mode="trade" square={square} />;
      })}
      <Paragraph>for</Paragraph>
      {targetProperties.map((square) => {
        return <SquareTitle game={props.game} key={square.id} mode="trade" square={square} />;
      })}
      <div style={{ marginTop: 24 }}>
        <Button
          disabled={!canAnswer}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.acceptTrade });
          }}
        >
          Accept
        </Button>
        <Button
          disabled={!canAnswer}
          onClick={() => {
            props.triggerUpdate({ type: GameUpdateType.declineTrade });
          }}
          type="delete"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
