import Abbreviator from "@rbxts/abbreviate";

export const zeroDecimalAbbreviator = new Abbreviator();
zeroDecimalAbbreviator.setSetting("decimalPlaces", 0);
zeroDecimalAbbreviator.setSetting("stripTrailingZeroes", true);

export const twoDpAbbreviator = new Abbreviator();
twoDpAbbreviator.setSetting("stripTrailingZeroes", true);

export const statsAbbreviator = new Abbreviator();
