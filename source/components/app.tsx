import React from 'react';
import { deserializeGame, serializeGame } from '../logic';
import { Game } from '../types';
import { CreateGame } from './create-game';
import { GameComponent } from './game';

const GAME_STORAGE_KEY = 'game';

export class App extends React.Component {
  state: { game: Game | undefined } = { game: undefined };

  static getDerivedStateFromError() {
    return { game: undefined };
  }

  componentDidMount() {
    const serializedGame = localStorage.getItem(GAME_STORAGE_KEY);
    this.setState({ game: deserializeGame(serializedGame) });
  }

  updateGame(game: Game | undefined) {
    this.setState({ game });

    if (game) {
      localStorage.setItem(GAME_STORAGE_KEY, serializeGame(game));
    } else {
      localStorage.removeItem(GAME_STORAGE_KEY);
    }
  }

  render() {
    return this.state.game ? (
      <GameComponent game={this.state.game} updateGame={this.updateGame.bind(this)} />
    ) : (
      <CreateGame setGame={this.updateGame.bind(this)} />
    );
  }
}
