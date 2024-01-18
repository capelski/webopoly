import React from 'react';
import { AnswerType, ChangeUiType, ModalType } from '../enums';
import { applyIncomingChanges } from '../logic';
import { Game, ModalChange } from '../types';
import { AcceptDeclineModal } from './accept-decline-modal';
import { CardModal } from './card-modal';
import { ChangeComponent } from './change';
import { Modal } from './modal';
import { OkModal } from './ok-modal';

type Renderer<T extends ModalType = ModalType> = (
  change: ModalChange & { modalType: T },
  game: Game,
  updateGame: (game: Game) => void,
) => React.ReactNode;

const modalsMap: {
  [TKey in ModalType]: Renderer<TKey>;
} = {
  [ModalType.cardModal]: (change, game, updateGame) => {
    return (
      <CardModal
        applyChangesHandler={() => {
          updateGame(
            applyIncomingChanges(game, {
              modalType: ModalType.cardModal,
              uiType: ChangeUiType.modal,
            }),
          );
        }}
        cardId={change.cardId}
        type={change.type}
      />
    );
  },
  [ModalType.okModal]: (change, game, updateGame) => {
    return (
      <OkModal
        applyChangesHandler={() => {
          updateGame(
            applyIncomingChanges(game, {
              modalType: ModalType.okModal,
              uiType: ChangeUiType.modal,
            }),
          );
        }}
      >
        <ChangeComponent change={change} game={game} />
      </OkModal>
    );
  },
  [ModalType.acceptDeclineModal]: (change, game, updateGame) => {
    return (
      <AcceptDeclineModal
        acceptHandler={() => {
          updateGame(
            applyIncomingChanges(game, {
              modalType: ModalType.acceptDeclineModal,
              params: { offerAnswer: AnswerType.accept },
              uiType: ChangeUiType.modal,
            }),
          );
        }}
        declineHandler={() => {
          updateGame(
            applyIncomingChanges(game, {
              modalType: ModalType.acceptDeclineModal,
              params: { offerAnswer: AnswerType.decline },
              uiType: ChangeUiType.modal,
            }),
          );
        }}
      >
        <ChangeComponent change={change} game={game} />
      </AcceptDeclineModal>
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
