export function capitalizeWords(str: string) {
  if (str)
    return str
      .replace(/[_\-/\\]/g, " ")
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase()
      )
      .join(" ");
  else return str;
}
