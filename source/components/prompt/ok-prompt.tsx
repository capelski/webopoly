import React from 'react';
import { Button } from '../button';

interface OkPromptProps {
  children?: React.ReactNode;
  okHandler: () => void;
}

export const OkPrompt: React.FC<OkPromptProps> = (props) => {
  return (
    <div>
      {props.children}
      <Button onClick={props.okHandler}>Ok</Button>
    </div>
  );
};
