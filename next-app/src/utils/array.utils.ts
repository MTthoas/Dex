export function transformerEnPaires(array: Array<unknown>) {
  let result = [];
  for (let i = 0; i < array.length; i += 2) {
    result.push({
      id: i / 2 + 1,
      valeur1: array[i],
      valeur2: array[i + 1] || "", // Gère le cas où le tableau a un nombre impair d'éléments
    });
  }
  return result;
}
