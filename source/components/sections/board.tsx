import React, { useEffect, useRef, useState } from 'react';
import { getCurrentSquare } from '../../logic';
import { Game, Id, Square } from '../../types';
import { SquareComponent } from '../square/square';

interface BoardProps {
  game: Game;
  updateGame: (game: Game | undefined) => void;
}

const getSquaresRefs = (
  squares: Square[],
): { [key: Id]: React.MutableRefObject<HTMLDivElement | null> } => {
  return squares.reduce<{ [key: Id]: React.MutableRefObject<HTMLDivElement | null> }>(
    (reduced, square) => ({ ...reduced, [square.id]: useRef<HTMLDivElement>(null) }),
    {},
  );
};

export const Board: React.FC<BoardProps> = (props) => {
  const [refs] = useState(getSquaresRefs(props.game.squares));
  const currentSquare = getCurrentSquare(props.game);

  useEffect(() => {
    refs[currentSquare.id].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [props.game]);

  return (
    <div
      style={{
        borderBottom: '2px solid black',
        display: 'flex',
        flexBasis: 250, // Sets the height, as parent has display: flex
        flexDirection: 'row',
        flexShrink: 0, // Sets the height, as parent has display: flex
        flexWrap: 'nowrap',
        overflowX: 'scroll',
        overflowY: 'hidden',
      }}
    >
      {props.game.squares.map((square) => (
        <SquareComponent
          game={props.game}
          key={`${square.name}-${square.id}`}
          rootRef={refs[square.id]}
          square={square}
          updateGame={props.updateGame}
        />
      ))}
    </div>
  );
};
