import React from 'react';
import { Button } from '../common/button';

interface OkPromptProps {
  children?: React.ReactNode;
  disabled?: boolean;
  okHandler: () => void;
}

export const OkPrompt: React.FC<OkPromptProps> = (props) => {
  return (
    <div style={{ textAlign: 'center' }}>
      {props.children}
      <Button disabled={props.disabled} onClick={props.okHandler}>
        Ok
      </Button>
    </div>
  );
};
