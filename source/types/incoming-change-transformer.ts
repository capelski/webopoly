import { ChangeType } from '../enums';
import { Game } from './game';
import { AcceptDeclineModalChange, IncomingChange } from './incoming-change';
import { AcceptDeclineModalParams } from './incoming-change-params';

export type IncomingChangeTransformer<
  T extends ChangeType = ChangeType,
  TIncoming extends IncomingChange = IncomingChange & { type: T },
> = (
  game: Game,
  change: TIncoming,
  params: TIncoming extends AcceptDeclineModalChange ? AcceptDeclineModalParams : undefined,
) => Game;
