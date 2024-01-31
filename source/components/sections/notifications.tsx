import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { EventSource, EventType } from '../../enums';
import { Game } from '../../types';
import { NotificationComponent } from '../common/event';

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
        (n) =>
          (n.type !== EventType.expense && n.type !== EventType.goToJail) ||
          !omitSources.includes(n.source),
      );

      applicableNotifications.forEach((notification) => {
        toast(<NotificationComponent notification={notification} game={props.game} />, {
          autoClose: 3000,
        });
      });

      props.updateGame({
        ...props.game,
        notifications: [],
        pastNotifications: [...props.game.notifications.reverse(), ...props.game.pastNotifications],
      });
    }
  }, [props.game.notifications]);

  return <ToastContainer />;
};
