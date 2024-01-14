import React from 'react';
import { ChangeUiType, ModalType } from '../enums';
import { applyIncomingChanges } from '../logic';
import { CardChange, Game, GenericChange, ModalChange } from '../types';
import { CardModal } from './card-modal';
import { ChangeComponent } from './change';
import { Modal } from './modal';
import { OkModal } from './ok-modal';

type Renderer<T extends ModalType = ModalType> = (
  change: T extends ModalType.cardModal
    ? CardChange
    : T extends ModalType.okModal
    ? GenericChange
    : never,
  game: Game,
  updateGame: (game: Game) => void,
) => React.ReactNode;

const modalsMap: {
  [TKey in ModalType]: Renderer<TKey>;
} = {
  [ModalType.cardModal]: (change, game, updateGame) => {
    return (
      <CardModal
        applyCardHandler={() => {
          updateGame(applyIncomingChanges(game, ChangeUiType.modal));
        }}
        cardId={change.cardId}
        type={change.type}
      />
    );
  },
  [ModalType.okModal]: (change, game, updateGame) => {
    return (
      <OkModal
        applyCardHandler={() => {
          updateGame(applyIncomingChanges(game, ChangeUiType.modal));
        }}
      >
        <ChangeComponent change={change} game={game} />
      </OkModal>
    );
  },
};

interface ModalChangeComponentProps {
  change: ModalChange;
  game: Game;
  updateGame: (game: Game) => void;
}

export const ModalChangeComponent: React.FC<ModalChangeComponentProps> = (props) => {
  const renderer: Renderer = modalsMap[props.change.modalType];
  return <Modal>{renderer(props.change, props.game, props.updateGame)}</Modal>;
};
