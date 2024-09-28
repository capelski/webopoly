import {
  clearNotifications,
  deserializeGame,
  Game,
  GameUpdate,
  getCurrentPlayer,
  Player,
  serializeGame,
  setDefaultTrigger,
  triggerUpdate,
} from '@webopoly/core';
import React from 'react';
import { GameComponent } from '../game';
import { StartLocalGame } from './start-local-game';

const LOCAL_GAME_STORAGE_KEY = 'localGame';

export type LocalGameProps = {
  cancel: () => void;
};

export class LocalGame extends React.Component<LocalGameProps> {
  state: { game: Game<any> | undefined } = { game: undefined };

  static getDerivedStateFromError() {
    return { game: undefined };
  }

  componentDidMount() {
    const serializedGame = localStorage.getItem(LOCAL_GAME_STORAGE_KEY);
    const game = deserializeGame(serializedGame);
    if (game) {
      this.setState({ game });
      setDefaultTrigger(game, this.updateGame.bind(this));
    }
  }

  clearNotificationsHandler() {
    if (this.state.game) {
      this.updateGame(clearNotifications(this.state.game));
    }
  }

  triggerUpdateHandler(gameUpdate: GameUpdate, playerId: Player['id']) {
    if (this.state.game) {
      triggerUpdate(this.state.game, gameUpdate, playerId, this.updateGame.bind(this));
    }
  }

  updateGame(game: Game<any>) {
    this.setState({ game });
    localStorage.setItem(LOCAL_GAME_STORAGE_KEY, serializeGame(game));

    if (!this.state.game && game) {
      setDefaultTrigger(game, this.updateGame.bind(this));
    }
  }

  exitGame() {
    this.setState({ game: undefined });
    localStorage.removeItem(LOCAL_GAME_STORAGE_KEY);

    if (this.state.game?.defaultAction) {
      clearTimeout(this.state.game.defaultAction.timer);
    }
  }

  render() {
    if (!this.state.game) {
      return <StartLocalGame cancel={this.props.cancel} setGame={this.updateGame.bind(this)} />;
    }
    const currentPlayer = getCurrentPlayer(this.state.game);

    return (
      <GameComponent
        clearNotifications={this.clearNotificationsHandler.bind(this)}
        exitGame={this.exitGame.bind(this)}
        game={this.state.game}
        triggerUpdate={(gameUpdate: GameUpdate) =>
          this.triggerUpdateHandler(gameUpdate, currentPlayer.id)
        }
        windowPlayerId={currentPlayer.id}
      />
    );
  }
}
