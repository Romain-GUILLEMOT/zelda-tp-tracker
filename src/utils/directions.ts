/**
 * Dynamically swaps direction directions in descriptions for Wii/Hero Mode.
 * Swaps: east <-> west, left <-> right, northeast <-> northwest, southeast <-> southwest.
 * Preserves grammatical casing.
 * 
 * @param text - The input description text.
 * @returns The text with mirrored directions.
 */
export function mirrorDirections(text: string): string {
  if (!text) return text;

  // Pattern matches specific direction words as whole words
  const pattern = /\b(northeast|northwest|southeast|southwest|eastern|western|east|west|right|left)\b/gi;

  return text.replace(pattern, (match) => {
    const lower = match.toLowerCase();
    let replacement = lower;

    switch (lower) {
      case "northeast":
        replacement = "northwest";
        break;
      case "northwest":
        replacement = "northeast";
        break;
      case "southeast":
        replacement = "southwest";
        break;
      case "southwest":
        replacement = "southeast";
        break;
      case "eastern":
        replacement = "western";
        break;
      case "western":
        replacement = "eastern";
        break;
      case "east":
        replacement = "west";
        break;
      case "west":
        replacement = "east";
        break;
      case "right":
        replacement = "left";
        break;
      case "left":
        replacement = "right";
        break;
      default:
        break;
    }

    // Preserve original text capitalization
    if (match === match.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (match[0] === match[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  });
}
