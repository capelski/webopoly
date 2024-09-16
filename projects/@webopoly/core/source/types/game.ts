import { GamePhase, PromptType } from '../enums';
import { Card } from './card';
import { DefaultAction } from './default-action';
import { Dice } from './dice';
import { GEvent, PendingEvent } from './event';
import { Player } from './player';
import { BuyPropertyPrompt, Prompt } from './prompt';
import { Square } from './square';

export type GameBase<TPhase extends GamePhase> = {
  centerPot: number;
  currentPlayerId: Player['id'];
  defaultAction: DefaultAction | undefined;
  dice: Dice;
  eventHistory: GEvent[];
  nextCardIds: Card['id'][];
  notifications: GEvent[];
  phase: TPhase;
  players: Player[];
  squares: Square[];
};

export type GameBuyPropertyLiquidationPhase = GameBase<GamePhase.buyPropertyLiquidation> & {
  pendingPrompt: BuyPropertyPrompt;
};

export type GameDiceAnimationPhase = GameBase<GamePhase.diceAnimation>;

export type GameDiceInJailAnimationPhase = GameBase<GamePhase.diceInJailAnimation>;

export type GameOutOfJailAnimationPhase = GameBase<GamePhase.outOfJailAnimation>;

export type GamePendingPaymentLiquidationPhase = GameBase<GamePhase.pendingPaymentLiquidation> & {
  pendingEvent: PendingEvent;
};

export type GamePlayerAnimationPhase = GameBase<GamePhase.playerAnimation> & {
  animation: {
    currentSquareId: Square['id'];
    pendingMoves: number;
    playerId: Player['id'];
  };
};

export type GamePlayPhase = GameBase<GamePhase.play>;

export type GamePromptPhase<TPrompt extends PromptType> = GameBase<GamePhase.prompt> & {
  prompt: Prompt<TPrompt>;
};

export type GameRollDicePhase = GameBase<GamePhase.rollDice>;

export type GameTradePhase = GameBase<GamePhase.trade> & {
  previousPhase: GamePhase.play | GamePhase.rollDice;
  other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
  ownSquaresId: Square['id'][];
};

export type Game =
  | GameBuyPropertyLiquidationPhase
  | GameDiceAnimationPhase
  | GameDiceInJailAnimationPhase
  | GameOutOfJailAnimationPhase
  | GamePromptPhase<PromptType>
  | GamePendingPaymentLiquidationPhase
  | GamePlayerAnimationPhase
  | GamePlayPhase
  | GameRollDicePhase
  | GameTradePhase;
