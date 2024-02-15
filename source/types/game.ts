import { PromptType, TransitionType } from '../enums';
import { Dice } from './dice';
import { GEvent } from './event';
import {
  CannotPayPhasePayload,
  PhasePayloadBase,
  PlayPhasePayload,
  PromptPhasePayload,
  RollDicePhasePayload,
  UiTransitionPhasePayload,
} from './game-phase-payload';
import { Id } from './id';
import { Player } from './player';
import { Square } from './square';

type GameBase<T extends PhasePayloadBase<any>> = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  eventHistory: GEvent[];
  nextChanceCardIds: Id[];
  nextCommunityCardIds: Id[];
  notifications: GEvent[];
  players: Player[];
  squares: Square[];
} & T;

export type GameCannotPayPhase = GameBase<CannotPayPhasePayload>;

export type GamePlayPhase = GameBase<PlayPhasePayload>;

export type GamePromptPhase<TPrompt extends PromptType> = GameBase<PromptPhasePayload<TPrompt>>;

export type GameRollDicePhase = GameBase<RollDicePhasePayload>;

export type GameUiTransitionPhase<TTransition extends TransitionType> = GameBase<
  UiTransitionPhasePayload<TTransition>
>;

export type GameNonPromptPhase =
  | GameCannotPayPhase
  | GamePlayPhase
  | GameRollDicePhase
  | GameUiTransitionPhase<TransitionType>;

export type Game = GameNonPromptPhase | GamePromptPhase<PromptType>;
