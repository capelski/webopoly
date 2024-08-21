import {
  clearNotifications,
  GameUpdate,
  Player,
  setDefaultTrigger,
  triggerRemovePlayer,
  triggerUpdate,
} from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { Button } from '../../common/button';
import { EditName } from '../../common/edit-name';
import { Paragraph } from '../../common/paragraph';
import { GameComponent } from '../game';
import { StarterPeerConnection } from './starter-peer-connection';
import { getInitialState, getPlayingState, getRoom } from './starter-peer-logic';
import { PlayerPending, PlayingState, StarterPeerState } from './starter-peer-state';
import { WebRTCMessageType } from './webrtc-message-type';

interface StarterPeerProps {
  exitRoom: () => void;
}

export const StarterPeer: React.FC<StarterPeerProps> = (props) => {
  const [peerState, setPeerState] = useState<StarterPeerState>(getInitialState);

  const updatePeerState = (nextPeerState: StarterPeerState) => {
    setPeerState(nextPeerState);

    nextPeerState.messagingGroup.broadcastMessage((player) => {
      return {
        type: WebRTCMessageType.roomUpdated,
        payload: getRoom(nextPeerState, player),
      };
    });
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
      const other = nextPeerState.messagingGroup.activeNodes.find(({ state }) => state === player)!;
      other.state.name = playerName;
    }

    updatePeerState(nextPeerState);
  };

  useEffect(() => {
    if (peerState.game) {
      peerState.messagingGroup.nodes.forEach((other) => {
        other.connection.on('connectionClosed', () => {
          peerState.messagingGroup.removeNode(other.connection);

          triggerRemovePlayer(peerState.game, other.state.id, (updatedGame) => {
            updatePeerState({ ...peerState, game: updatedGame });
          });
        });

        other.connection.on('messageReceived', (message) => {
          if (message.type === WebRTCMessageType.gameUpdate) {
            triggerUpdateHandler(peerState, message.payload, other.state.id);
          }
        });
      });
    } else {
      peerState.messagingGroup.nodes.forEach((other) => {
        other.connection.on('connectionReady', () => {
          updatePeerState({ ...peerState }); // Necessary to re-evaluate react state
        });

        other.connection.on('connectionClosed', () => {
          peerState.messagingGroup.removeNode(other.connection);
          updatePeerState({ ...peerState });
        });

        other.connection.on('messageReceived', (message) => {
          if (message.type === WebRTCMessageType.playerNameUpdate) {
            updatePlayerName(message.payload, other.state);
          }
        });
      });
    }

    const onWindowClose = (event: Event) => {
      event.preventDefault();
      peerState.messagingGroup.closeAllConnections();
    };

    window.addEventListener('unload', onWindowClose);
    return () => {
      window.removeEventListener('unload', onWindowClose);
    };
  }, [peerState]);

  const exitRoom = () => {
    peerState.messagingGroup.closeAllConnections();
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
        {peerState.messagingGroup.nodes.map((player, index) => {
          return (
            <StarterPeerConnection
              key={index}
              messagingConnection={player.connection}
              playerName={player.state.name}
              removeConnection={() => {
                if (player.connection.isActive) {
                  player.connection.closeConnection();
                } else {
                  peerState.messagingGroup.removeNode(player.connection);
                  updatePeerState({ ...peerState });
                }
              }}
            />
          );
        })}
      </div>

      <div>
        <Button
          onClick={() => {
            peerState.messagingGroup.addNode({
              name: `Player ${peerState.messagingGroup.nodes.length + 2}`,
            });
            setPeerState({
              ...peerState,
            });
          }}
          style={{ marginLeft: 8 }}
          type="border"
        >
          Add player slot
        </Button>
        <Button
          disabled={
            peerState.messagingGroup.nodes.length === 0 ||
            peerState.messagingGroup.nodes.some((node) => !node.connection.isActive)
          }
          onClick={() => {
            const nextPeerState = getPlayingState(peerState);
            updatePeerState(nextPeerState);
            setDefaultTrigger(nextPeerState.game, (updatedGame) => {
              updatePeerState({ ...nextPeerState, game: updatedGame });
            });
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
