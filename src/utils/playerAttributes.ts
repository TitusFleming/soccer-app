interface Player {
  height?: string | null;
  weight?: string | null;
  foot?: string | null;
  // add other player properties as needed
}

export function getPhysicalCharacteristics(player: Player): string {
  const characteristics = [];
  
  if (player.height) characteristics.push(`height of ${player.height}`);
  if (player.weight) characteristics.push(`weight of ${player.weight}`);
  if (player.foot) characteristics.push(`preferred foot is ${player.foot}`);
  
  return characteristics.join(', ');
}

export function getHeight(player: Player): string | null {
  return player.height || null;
}

export function getWeight(player: Player): string | null {
  return player.weight || null;
}

export function getFootedness(player: Player): string | null {
  return player.foot || null;
}
