import React from 'react';
import { clearNotifications, deserializeGame, Game, serializeGame } from '../../../../../core';
import { GameComponent } from '../game';
import { StartLocalGame } from './start-local-game';

const LOCAL_GAME_STORAGE_KEY = 'localGame';

export type LocalGameProps = {
  cancel: () => void;
};

export class LocalGame extends React.Component<LocalGameProps> {
  state: { game: Game | undefined } = { game: undefined };

  static getDerivedStateFromError() {
    return { game: undefined };
  }

  componentDidMount() {
    const serializedGame = localStorage.getItem(LOCAL_GAME_STORAGE_KEY);
    const game = deserializeGame(serializedGame);
    if (game) {
      console.log(`Local game resumed`);
      this.setState({ game });
    }
  }

  clearNotificationsHandler() {
    if (this.state.game) {
      this.updateGame(clearNotifications(this.state.game));
    }
  }

  updateGame(game: Game) {
    this.setState({ game });
    localStorage.setItem(LOCAL_GAME_STORAGE_KEY, serializeGame(game));
  }

  exitGame() {
    this.setState({ game: undefined });
    localStorage.removeItem(LOCAL_GAME_STORAGE_KEY);
  }

  render() {
    return this.state.game ? (
      <GameComponent
        clearNotifications={this.clearNotificationsHandler.bind(this)}
        exitGame={this.exitGame.bind(this)}
        game={this.state.game}
        updateGame={this.updateGame.bind(this)}
        windowPlayerId={this.state.game.currentPlayerId}
      />
    ) : (
      <StartLocalGame cancel={this.props.cancel} setGame={this.updateGame.bind(this)} />
    );
  }
}
