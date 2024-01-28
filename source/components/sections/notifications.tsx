import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { NotificationSource, NotificationType } from '../../enums';
import { Game } from '../../types';
import { NotificationComponent } from '../common/notification';

interface NotificationsProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

const omitSources = [
  NotificationSource.chanceCard,
  NotificationSource.communityCard,
  NotificationSource.jailSquare,
];

export const Notifications: React.FC<NotificationsProps> = (props) => {
  useEffect(() => {
    if (props.game.notifications.length > 0) {
      const applicableNotifications = props.game.notifications.filter(
        (n) =>
          (n.type !== NotificationType.expense && n.type !== NotificationType.goToJail) ||
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
