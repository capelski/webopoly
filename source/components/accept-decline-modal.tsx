import React from 'react';
import { Button } from './button';

interface AcceptDeclineModalProps {
  acceptHandler: () => void;
  children?: React.ReactNode;
  declineHandler: () => void;
}

export const AcceptDeclineModal: React.FC<AcceptDeclineModalProps> = (props) => {
  return (
    <div>
      {props.children}
      <div>
        <Button onClick={props.acceptHandler}>Accept</Button>
        <Button onClick={props.declineHandler}>Decline</Button>
      </div>
    </div>
  );
};
