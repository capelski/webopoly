import { GamePhase, LiquidationReason, PromptType } from '../enums';
import { Card } from './card';
import { DefaultAction } from './default-action';
import { Dice } from './dice';
import { GEvent } from './event';
import {
  LiquidationPhasePayload,
  PhasePayloadBase,
  PromptPhasePayload,
  RollDicePhasePayload,
  TradePhasePayload,
} from './game-phase-payload';
import { Player } from './player';
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

export type GameDiceAnimationPhase = GameBase<{ phase: GamePhase.diceAnimation }>;

export type GameDiceInJailAnimationPhase = GameBase<{ phase: GamePhase.diceInJailAnimation }>;

export type GameLiquidationPhase<TReason extends LiquidationReason> = GameBase<
  LiquidationPhasePayload<TReason>
>;

export type GameOutOfJailAnimationPhase = GameBase<{ phase: GamePhase.outOfJailAnimation }>;

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

export type GameRollDicePhase = GameBase<RollDicePhasePayload>;

export type GameTradePhase = GameBase<TradePhasePayload>;

export type GameNonPromptPhase =
  | GameDiceAnimationPhase
  | GameDiceInJailAnimationPhase
  | GameLiquidationPhase<LiquidationReason>
  | GameOutOfJailAnimationPhase
  | GamePlayerAnimationPhase
  | GamePlayPhase
  | GameRollDicePhase;

export type Game = GameNonPromptPhase | GamePromptPhase<PromptType> | GameTradePhase;
