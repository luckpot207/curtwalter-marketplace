const LAMPORTS_PER_SOL = 10;

export function lamportsToSOL(price: string | number | undefined) {
  if (typeof price === "undefined") {
    return 0;
  } else if (typeof price === "string") {
    price = parseInt(price, 10);
    const sol = price / LAMPORTS_PER_SOL;
    return Math.round(sol * 100) / 100;
  } else {
    if (isNaN(price)) {
      return 0;
    }
    return Math.round((price / LAMPORTS_PER_SOL) * 100) / 100;
  }
}
