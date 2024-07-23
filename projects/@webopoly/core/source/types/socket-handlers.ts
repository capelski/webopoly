export type SocketHandlers<T> = {
  [TKey in keyof T]: (data: T[TKey]) => void;
};
