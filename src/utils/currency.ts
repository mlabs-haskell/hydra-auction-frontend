export const ADA_CURRENCY_SYMBOL = '₳'; // ADA

export function numberWithCommas(num: number | string) {
  return num.toLocaleString();
}

export function lovelaceToAda(amount: number | string | undefined) {
  return Number(amount) / 1_000_000;
}

export function formatLovelaceToAda(amount: number | string | undefined) {
  const formattedNum = numberWithCommas(lovelaceToAda(amount));
  return formattedNum !== 'NaN' ? formattedNum : '-';
}
