export const ADA_CURRENCY_SYMBOL = '₳'; // ADA

export function numberWithCommas(num: number | string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
