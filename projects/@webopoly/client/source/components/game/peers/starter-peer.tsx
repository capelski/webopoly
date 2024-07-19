import React, { useEffect, useState } from 'react';
import {
  clearNotifications,
  GameUpdate,
  Player,
  triggerRemovePlayer,
  triggerUpdate,
} from '../../../../../core';
import { Button } from '../../common/button';
import { EditName } from '../../common/edit-name';
import { Paragraph } from '../../common/paragraph';
import { GameComponent } from '../game';
import { StarterPeerConnection } from './starter-peer-connection';
import {
  broadcastRoomUpdate,
  getInitialState,
  getNewPlayer,
  getPlayingState,
  terminateAllConnections,
} from './starter-peer-logic';
import { PendingState, PlayerPending, PlayingState, StarterPeerState } from './starter-peer-state';
import { WebRTCMessageType } from './webrtc-message-type';

interface StarterPeerProps {
  exitRoom: () => void;
}

export const StarterPeer: React.FC<StarterPeerProps> = (props) => {
  const [peerState, setPeerState] = useState<StarterPeerState>(getInitialState);

  const updatePeerState = (nextPeerState: StarterPeerState) => {
    setPeerState(nextPeerState);
    broadcastRoomUpdate(nextPeerState);
  };

  const triggerUpdateHandler = (
    playingState: PlayingState,
    gameUpdate: GameUpdate,
    playerId: Player['id'],
  ) => {
    triggerUpdate(playingState.game, gameUpdate, playerId, (updatedGame) => {
      updatePeerState({ ...playingState, game: updatedGame });
    });
  };

  // TODO Prevent name conflicts
  const updatePlayerName = (playerName: Player['name'], player: PlayerPending) => {
    const nextPeerState = { ...peerState };

    if (player === nextPeerState.self) {
      nextPeerState.self.name = playerName;
    } else {
      nextPeerState.others = nextPeerState.others.map((other) =>
        other === player ? { ...other, name: playerName } : other,
      );
    }

    updatePeerState(nextPeerState);
  };

  useEffect(() => {
    if (peerState.game) {
      peerState.others.forEach((other) => {
        other.connection.on('connectionClosed', () => {
          updatePeerState({
            ...peerState,
            game: triggerRemovePlayer(peerState.game, other.id),
            others: peerState.others.filter((o) => o !== other),
          });
        });

        other.connection.on('messageReceived', (message) => {
          if (message.type === WebRTCMessageType.gameUpdate) {
            triggerUpdateHandler(peerState, message.payload, other.id);
          }
        });
      });
    } else {
      peerState.others.forEach((other) => {
        other.connection.on('connectionReady', () => {
          updatePeerState({ ...peerState }); // Necessary to re-evaluate react state
        });

        other.connection.on('connectionClosed', () => {
          updatePeerState({
            ...peerState,
            others: peerState.others.filter((o) => o !== other),
          });
        });

        other.connection.on('messageReceived', (message) => {
          if (message.type === WebRTCMessageType.playerNameUpdate) {
            updatePlayerName(message.payload, other);
          }
        });
      });
    }

    const onWindowClose = (event: Event) => {
      event.preventDefault();
      terminateAllConnections(peerState);
    };

    window.addEventListener('unload', onWindowClose);
    return () => {
      window.removeEventListener('unload', onWindowClose);
    };
  }, [peerState]);

  const exitRoom = () => {
    terminateAllConnections(peerState);
    props.exitRoom();
  };

  return peerState.game ? (
    <GameComponent
      clearNotifications={() => {
        setPeerState({ ...peerState, game: clearNotifications(peerState.game) });
      }}
      exitGame={exitRoom}
      game={peerState.game}
      triggerUpdate={(update) => triggerUpdateHandler(peerState, update, peerState.self.id)}
      windowPlayerId={peerState.self.id}
    />
  ) : (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100dvh',
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <Paragraph style={{ fontWeight: 'bold' }}>Players</Paragraph>
        <EditName
          playerName={peerState.self.name}
          updatePlayerName={(playerName) => updatePlayerName(playerName, peerState.self)}
        />
        {peerState.others.map((player, index) => {
          return (
            <StarterPeerConnection
              key={index}
              messagingConnection={player.connection}
              playerName={player.name}
              removeConnection={() => {
                if (player.connection.isActive) {
                  player.connection.closeConnection();
                } else {
                  const nextPeerState: PendingState = {
                    ...peerState,
                    others: peerState.others.filter((other) => other !== player),
                  };

                  updatePeerState(nextPeerState);
                }
              }}
            />
          );
        })}
      </div>

      <div>
        <Button
          onClick={() => {
            setPeerState({
              ...peerState,
              others: [...peerState.others, getNewPlayer(2 + peerState.others.length)],
            });
          }}
          style={{ marginLeft: 8 }}
          type="border"
        >
          Add player slot
        </Button>
        <Button
          disabled={
            peerState.others.length === 0 || peerState.others.some((p) => !p.connection.isActive)
          }
          onClick={() => {
            const nextPeerState = getPlayingState(peerState);
            updatePeerState(nextPeerState);
          }}
        >
          Start
        </Button>
        <Button onClick={exitRoom} type="delete">
          Exit
        </Button>
      </div>

      <div>
        <p style={{ margin: 8, padding: 8 }}>
          🛜 If a player is using a private network (e.g. a WiFi connection) the other player needs
          to use the same private network
        </p>
      </div>
    </div>
  );
};
