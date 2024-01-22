import React from 'react';
import { Button } from '../button';

interface AnswerOfferPromptProps {
  acceptHandler: () => void;
  children?: React.ReactNode;
  declineHandler: () => void;
}

export const AnswerOfferPrompt: React.FC<AnswerOfferPromptProps> = (props) => {
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
