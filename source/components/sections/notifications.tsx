import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { EventSource, EventType } from '../../enums';
import { Game } from '../../types';
import { EventComponent } from '../common/event';

interface NotificationsProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

const omitSources = [
  EventSource.chanceCard,
  EventSource.communityChestCard,
  EventSource.jailSquare,
];

export const Notifications: React.FC<NotificationsProps> = (props) => {
  useEffect(() => {
    if (props.game.notifications.length > 0) {
      const applicableNotifications = props.game.notifications.filter(
        (e) =>
          (e.type !== EventType.expense && e.type !== EventType.goToJail) ||
          !omitSources.includes(e.source),
      );

      applicableNotifications.forEach((event) => {
        toast(<EventComponent event={event} game={props.game} />, {
          autoClose: 3000,
        });
      });

      props.updateGame({
        ...props.game,
        notifications: [],
        eventHistory: [...props.game.notifications.reverse(), ...props.game.eventHistory],
      });
    }
  }, [props.game.notifications]);

  return <ToastContainer />;
};
