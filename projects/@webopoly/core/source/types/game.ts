import { GamePhase, PromptType } from '../enums';
import { Card } from './card';
import { DefaultAction } from './default-action';
import { Dice } from './dice';
import { GEvent, PendingEvent } from './event';
import { PhasePayloadBase, PromptPhasePayload, TradePhasePayload } from './game-phase-payload';
import { Player } from './player';
import { BuyPropertyPrompt } from './prompt';
import { Square } from './square';

export type GameBase<T extends PhasePayloadBase<any>> = {
  centerPot: number;
  currentPlayerId: Player['id'];
  defaultAction: DefaultAction | undefined;
  dice: Dice;
  eventHistory: GEvent[];
  nextCardIds: Card['id'][];
  notifications: GEvent[];
  players: Player[];
  squares: Square[];
} & T;

export type GameBuyPropertyLiquidationPhase = GameBase<{
  phase: GamePhase.buyPropertyLiquidation;
  pendingPrompt: BuyPropertyPrompt;
}>;

export type GameDiceAnimationPhase = GameBase<{ phase: GamePhase.diceAnimation }>;

export type GameDiceInJailAnimationPhase = GameBase<{ phase: GamePhase.diceInJailAnimation }>;

export type GameOutOfJailAnimationPhase = GameBase<{ phase: GamePhase.outOfJailAnimation }>;

export type GamePendingPaymentLiquidationPhase = GameBase<{
  phase: GamePhase.pendingPaymentLiquidation;
  pendingEvent: PendingEvent;
}>;

export type GamePlayerAnimationPhase = GameBase<{
  phase: GamePhase.playerAnimation;
  animation: {
    currentSquareId: Square['id'];
    pendingMoves: number;
    playerId: Player['id'];
  };
}>;

export type GamePlayPhase = GameBase<{ phase: GamePhase.play }>;

export type GamePromptPhase<TPrompt extends PromptType> = GameBase<PromptPhasePayload<TPrompt>>;

export type GameRollDicePhase = GameBase<{ phase: GamePhase.rollDice }>;

export type GameTradePhase = GameBase<TradePhasePayload>;

export type GameNonPromptPhase =
  | GameBuyPropertyLiquidationPhase
  | GameDiceAnimationPhase
  | GameDiceInJailAnimationPhase
  | GameOutOfJailAnimationPhase
  | GamePendingPaymentLiquidationPhase
  | GamePlayerAnimationPhase
  | GamePlayPhase
  | GameRollDicePhase;

export type Game = GameNonPromptPhase | GamePromptPhase<PromptType> | GameTradePhase;
