import React from 'react';
import { Button } from './button';

interface OkModalProps {
  applyChangesHandler: () => void;
  children?: React.ReactNode;
}

export const OkModal: React.FC<OkModalProps> = (props) => {
  return (
    <div>
      {props.children}
      <Button onClick={props.applyChangesHandler}>Ok</Button>
    </div>
  );
};
