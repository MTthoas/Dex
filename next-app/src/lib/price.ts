// Transform price to string with k suffix if greater than 1000 or m suffix if greater than 1000000

export function formatPrice(price: number): string {
    if (price > 1000000) {
      return `${(price / 1000000).toFixed(2)}m`;
    }
    if (price > 1000) {
      return `${(price / 1000).toFixed(2)}k`;
    }
    return price.toFixed(2);
  }