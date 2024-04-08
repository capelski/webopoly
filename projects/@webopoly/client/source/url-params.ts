import { gameIdQueryStringParameter } from './parameters';

export const getGameIdParameter = () => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  return params.get(gameIdQueryStringParameter);
};
