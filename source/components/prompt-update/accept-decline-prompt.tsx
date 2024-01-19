import React from 'react';
import { Button } from '../button';

interface AcceptDeclinePromptProps {
  acceptHandler: () => void;
  children?: React.ReactNode;
  declineHandler: () => void;
}

export const AcceptDeclinePrompt: React.FC<AcceptDeclinePromptProps> = (props) => {
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
