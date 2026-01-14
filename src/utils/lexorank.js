const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

export function getIntermediateRank(prev, next) {
  if (!prev && !next) return "0|h";
  
  const p = prev ? prev.split('|')[1] || "" : "";
  const n = next ? next.split('|')[1] || "" : "";
  
  let result = '';
  let i = 0;

  while (true) {
    const pVal = i < p.length ? ALPHABET.indexOf(p[i]) : 0;
    const nVal = i < n.length ? ALPHABET.indexOf(n[i]) : ALPHABET.length - 1;

    if (nVal - pVal > 1) {
      const mid = Math.floor((pVal + nVal) / 2);
      result += ALPHABET[mid];
      return `0|${result}`;
    }
    result += ALPHABET[pVal];
    i++;
    if (i > 100) return `0|${result}m`; 
  }
}