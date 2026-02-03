import { Region } from "@prisma/client";

export function parseRegion(input: string): Region | null {
  const v = input.toLowerCase();
  if (v === "east") return Region.EAST;
  if (v === "west") return Region.WEST;
  return null;
}

export function regionLabel(region: Region) {
  return region === Region.EAST ? "東日本" : "西日本";
}
