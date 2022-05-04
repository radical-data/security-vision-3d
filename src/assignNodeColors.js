export function assignNodeColors(property) {
  const remainder = property % 6;
  if (remainder == 0) {
    return 0xee2997;
  } else if (remainder == 1) {
    return 0xa37e6e;
  } else if (remainder == 2) {
    return 0x773264;
  } else if (remainder == 3) {
    return 0xc9a33b;
  } else if (remainder == 4) {
    return 0xea3609;
  } else {
    return 0x773264;
  }
}
