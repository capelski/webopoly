import { ChangeType } from '../enums';
import { Game } from './game';
import { AcceptDeclinePrompt, UiUpdate } from './ui-update';
import { AcceptDeclinePromptParams } from './ui-update-params';

export type UiUpdateTransformer<
  TChange extends ChangeType = ChangeType,
  TUpdate extends UiUpdate = UiUpdate & { type: TChange },
> = (
  game: Game,
  change: TUpdate,
  params: TUpdate extends AcceptDeclinePrompt ? AcceptDeclinePromptParams : undefined,
) => Game;
