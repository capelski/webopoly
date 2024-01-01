import React from 'react';
import { applyNotifications } from '../actions';
import { ModalType, NotificationType } from '../enums';
import { Game, ModalNotification, TypedModalEvent } from '../types';
import { CardModal } from './card-modal';
import { GameEventComponent } from './game-event';
import { Modal } from './modal';
import { OkModal } from './ok-modal';

const modalsMap: {
  [TKey in ModalType]: (
    game: Game,
    modal: TypedModalEvent<TKey>,
    updateGame: (game: Game) => void,
  ) => React.ReactNode;
} = {
  [ModalType.cardModal]: (game, event, updateGame) => {
    return (
      <CardModal
        applyCardHandler={() => {
          updateGame(applyNotifications(game, NotificationType.modal));
        }}
        cardId={event.cardId}
        type={event.type}
      />
    );
  },
  [ModalType.okModal]: (game, event, updateGame) => {
    return (
      <OkModal
        applyCardHandler={() => {
          updateGame(applyNotifications(game, NotificationType.modal));
        }}
      >
        <GameEventComponent event={event} game={game} />
      </OkModal>
    );
  },
};

interface NotificationModalProps {
  game: Game;
  modal: ModalNotification;
  updateGame: (game: Game) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = (props) => {
  return (
    <Modal>
      {modalsMap[props.modal.modalType](props.game, props.modal as any, props.updateGame)}
    </Modal>
  );
};
