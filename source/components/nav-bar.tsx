import React from 'react';
import { GameView } from '../enums';

interface NavBarProps {
  gameView: GameView;
  setGameView: (gameView: GameView) => void;
}

interface NavBarTabProps extends NavBarProps {
  text: string;
  view: GameView;
}

const NavBarTab: React.FC<NavBarTabProps> = (props) => (
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

export const NavBar: React.FC<NavBarProps> = (props) => {
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
      <NavBarTab {...props} view={GameView.board} text="🧭" />
      <NavBarTab {...props} view={GameView.players} text="👤" />
    </div>
  );
};
