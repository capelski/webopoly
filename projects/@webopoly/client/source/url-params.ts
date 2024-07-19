import { GameMode } from './components/game/game-mode';
import { peersGameIdQueryString, serverGameIdQueryString } from './parameters';

export const getGameIdParameter = (mode: GameMode.peers | GameMode.server) => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  return params.get(mode === GameMode.peers ? peersGameIdQueryString : serverGameIdQueryString);
};
