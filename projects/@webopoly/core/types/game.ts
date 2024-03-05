import { LiquidationReason, PromptType, TransitionType } from '../enums';
import { Card } from './card';
import { Dice } from './dice';
import { GEvent } from './event';
import {
  LiquidationPhasePayload,
  PhasePayloadBase,
  PlayPhasePayload,
  PromptPhasePayload,
  RollDicePhasePayload,
  TradePhasePayload,
  UiTransitionPhasePayload,
} from './game-phase-payload';
import { Player } from './player';
import { Square } from './square';

export type GameBase<T extends PhasePayloadBase<any>> = {
  centerPot: number;
  currentPlayerId: Player['id'];
  dice: Dice;
  eventHistory: GEvent[];
  nextCardIds: Card['id'][];
  notifications: GEvent[];
  players: Player[];
  squares: Square[];
} & T;

export type GameLiquidationPhase<TReason extends LiquidationReason> = GameBase<
  LiquidationPhasePayload<TReason>
>;

export type GamePlayPhase = GameBase<PlayPhasePayload>;

export type GamePromptPhase<TPrompt extends PromptType> = GameBase<PromptPhasePayload<TPrompt>>;

export type GameRollDicePhase = GameBase<RollDicePhasePayload>;

export type GameTradePhase = GameBase<TradePhasePayload>;

export type GameUiTransitionPhase<TTransition extends TransitionType> = GameBase<
  UiTransitionPhasePayload<TTransition>
>;

export type GameNonPromptPhase =
  | GameLiquidationPhase<LiquidationReason>
  | GamePlayPhase
  | GameRollDicePhase
  | GameUiTransitionPhase<TransitionType>;

export type Game = GameNonPromptPhase | GamePromptPhase<PromptType> | GameTradePhase;
