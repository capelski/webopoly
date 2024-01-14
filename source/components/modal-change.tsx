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
  applyChangesHandler: () => void,
  game: Game,
) => React.ReactNode;

const modalsMap: {
  [TKey in ModalType]: Renderer<TKey>;
} = {
  [ModalType.cardModal]: (change, applyChangesHandler) => {
    return (
      <CardModal
        applyChangesHandler={applyChangesHandler}
        cardId={change.cardId}
        type={change.type}
      />
    );
  },
  [ModalType.okModal]: (change, applyChangesHandler, game) => {
    return (
      <OkModal applyChangesHandler={applyChangesHandler}>
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
  const applyChangesHandler = () => {
    props.updateGame(applyIncomingChanges(props.game, ChangeUiType.modal));
  };
  return <Modal>{renderer(props.change, applyChangesHandler, props.game)}</Modal>;
};
