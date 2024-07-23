import { Player } from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Paragraph } from './paragraph';

interface EditNameProps {
  playerName: Player['name'];
  updatePlayerName: (playerName: Player['name']) => void;
}

export const EditName: React.FC<EditNameProps> = (props) => {
  const [editName, setEditName] = useState(false);
  const [playerName, setPlayerName] = useState(props.playerName);
  const [updateName, setUpdateName] = useState(true);
  // Necessary to prevent other player updates restoring the current player name

  useEffect(() => {
    if (updateName) {
      setEditName(false);
      setPlayerName(props.playerName);
      setUpdateName(false);
    }
  }, [props.playerName]);

  return (
    <div style={{ alignItems: 'baseline', display: 'flex' }}>
      {editName ? (
        <React.Fragment>
          <Input
            onChange={(event) => {
              setPlayerName(event.target.value);
            }}
            placeholder="Player name"
            value={playerName}
          />
          <Button
            onClick={() => {
              if (props.playerName !== playerName) {
                setUpdateName(true);
                props.updatePlayerName(playerName);
              }
            }}
            type="transparent"
          >
            💾
          </Button>
          <Button
            onClick={() => {
              setEditName(false);
              setPlayerName(props.playerName);
            }}
            type="transparent"
          >
            ❌
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Paragraph>{props.playerName}</Paragraph>
          <Button
            onClick={() => {
              setEditName(true);
            }}
            type="transparent"
          >
            ✏️
          </Button>
        </React.Fragment>
      )}
    </div>
  );
};
