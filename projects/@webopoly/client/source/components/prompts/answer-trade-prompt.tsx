import {
  canAnswerTrade,
  Game_AnswerTrade,
  GameUpdateType,
  getPlayerById,
  getSquareById,
  PropertySquare,
} from '@webopoly/core';
import React from 'react';
import { Button } from '../common/button';
import { Paragraph } from '../common/paragraph';
import { SquareTitle } from '../common/square-title';
import { Title } from '../common/title';
import { PromptInterface } from './prompt-interface';

export const AnswerTradePrompt: PromptInterface<Game_AnswerTrade> = (props) => {
  const initiatorPlayer = getPlayerById(props.game, props.game.phaseData.playerId);
  const initiatorProperties = props.game.phaseData.playerPropertiesId.map((pId) =>
    getSquareById(props.game, pId),
  ) as PropertySquare[];
  const targetPlayer = getPlayerById(props.game, props.game.phaseData.targetPlayerId);
  const targetProperties = props.game.phaseData.targetPropertiesId.map((pId) =>
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
          autoClick={GameUpdateType.declineTrade}
          defaultAction={props.game.defaultAction}
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
