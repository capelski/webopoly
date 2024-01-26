import React from 'react';
import { GameView } from '../../enums';

interface MobileBarTabProps extends MobileBarProps {
  text: string;
  view: GameView;
}

const MobileBarTab: React.FC<MobileBarTabProps> = (props) => (
  <div
    onClick={() => props.setGameView(props.view)}
    style={{
      textShadow: props.gameView === props.view ? '0 0 5px goldenrod' : undefined,
      textAlign: 'center',
      flexGrow: 1,
    }}
  >
    {props.text}
  </div>
);

interface MobileBarProps {
  gameView: GameView;
  setGameView: (gameView: GameView) => void;
}

export const MobileBar: React.FC<MobileBarProps> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontSize: 32,
        position: 'sticky',
        top: 0,
        backgroundColor: '#efefef',
        borderTop: '1px solid lightgrey',
        padding: '4px 0',
      }}
    >
      <MobileBarTab {...props} view={GameView.board} text="🧭" />
      <MobileBarTab {...props} view={GameView.panel} text="👤" />
    </div>
  );
};
