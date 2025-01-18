type Player = {
  name: string;
  age: number | null;
  position: string | null;
  foot: string | null;
  height: string | null;
  weight: string | null;
  goals_per90: number | null;
  assists_per90: number | null;
  [key: string]: any;
};

export function getHeight(player: Player): string | null {
  return player.height;
}

export function getWeight(player: Player): string | null {
  return player.weight;
}

export function getFootedness(player: Player): string | null {
  return player.foot;
}

export function getPhysicalCharacteristics(player: Player): string {
  const height = getHeight(player);
  const weight = getWeight(player);
  const foot = getFootedness(player);
  
  return `${player.name} is ${height} tall, weighs ${weight}, and is ${foot}-footed.`;
}

export function getAge(player: Player): number | null {
  return player.age;
}

export function getPosition(player: Player): string | null {
  return player.position;
}

export function getGoalsPerNinety(player: Player): number | null {
  return player.goals_per90;
}

export function getAssistsPerNinety(player: Player): number | null {
  return player.assists_per90;
}
