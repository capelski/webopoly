import React from 'react';
import { deserializeGame, Game, serializeGame } from '../../../../../core';
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

  updateGame(game: Game | undefined) {
    this.setState({ game });
    this.props;
    if (game) {
      localStorage.setItem(LOCAL_GAME_STORAGE_KEY, serializeGame(game));
    } else {
      localStorage.removeItem(LOCAL_GAME_STORAGE_KEY);
      this.props.cancel();
    }
  }

  render() {
    return this.state.game ? (
      <GameComponent game={this.state.game} updateGame={this.updateGame.bind(this)} />
    ) : (
      <StartLocalGame cancel={this.props.cancel} setGame={this.updateGame.bind(this)} />
    );
  }
}
