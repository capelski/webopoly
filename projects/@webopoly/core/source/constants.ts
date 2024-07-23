export const jailFine = 50;
export const maxTurnsInJail = 3;
export const passGoMoney = 200;
export const playerInitialMoney = 1500;
export const rentPercentage = 0.05;
export const mortgagePercentage = 0.5;
export const clearMortgageRate = 1.1;
export const stationRents: { [stationsNumber: number]: number } = {
  1: 25,
  2: 50,
  3: 100,
  4: 200,
};
export const housesMax = 5;
export const houseBuildPercentage = 0.6;
export const houseSellPercentage = 0.3;
export const houseRents: { [housesNumber: number]: number } = {
  1: 0.5,
  2: 1,
  3: 3,
  4: 4,
  5: 5,
};

export const diceTransitionDuration = 1; // In seconds
export const playerTransitionDuration = 0.4; // In seconds

// TODO Server should not know about currency symbol
export const currencySymbol = '￡';
