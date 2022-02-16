import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

interface Rank {
	currencyMultiplier: number;
	cost: {
		amount: number;
		currency: Currency;
		requiredLevel: number;
	};
}

export const RANKS: Array<Rank> = [
	{
		// rank 1
		currencyMultiplier: 1.05,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("1k"),
			currency: "gold",
			requiredLevel: 2,
		},
	},
	{
		// rank 2
		currencyMultiplier: 1.075,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("2.5k"),
			currency: "gold",
			requiredLevel: 4,
		},
	},
	{
		// rank 3
		currencyMultiplier: 1.1,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("7.5k"),
			currency: "gold",
			requiredLevel: 8,
		},
	},
	{
		// rank 4
		currencyMultiplier: 1.125,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("12.5k"),
			currency: "gold",
			requiredLevel: 12,
		},
	},
	{
		// rank 5
		currencyMultiplier: 1.15,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("20k"),
			currency: "gold",
			requiredLevel: 16,
		},
	},
	{
		// rank 6
		currencyMultiplier: 1.175,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("30k"),
			currency: "gold",
			requiredLevel: 20,
		},
	},
	{
		// rank 7
		currencyMultiplier: 1.2,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("75k"),
			currency: "gold",
			requiredLevel: 25,
		},
	},
	{
		// rank 8
		currencyMultiplier: 1.25,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("150k"),
			currency: "gold",
			requiredLevel: 30,
		},
	},
	{
		// rank 9
		currencyMultiplier: 1.3,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("375k"),
			currency: "gold",
			requiredLevel: 35,
		},
	},
	{
		// rank 10
		currencyMultiplier: 1.35,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("750k"),
			currency: "gold",
			requiredLevel: 40,
		},
	},
	{
		// rank 11
		currencyMultiplier: 1.4,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("1.875M"),
			currency: "gold",
			requiredLevel: 45,
		},
	},
	{
		// rank 12
		currencyMultiplier: 1.45,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("3.75M"),
			currency: "gold",
			requiredLevel: 50,
		},
	},
	{
		// rank 13
		currencyMultiplier: 1.5,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("11.25M"),
			currency: "gold",
			requiredLevel: 55,
		},
	},
	{
		// rank 14
		currencyMultiplier: 1.6,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("22.5M"),
			currency: "gold",
			requiredLevel: 60,
		},
	},
	{
		// rank 15
		currencyMultiplier: 1.7,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("135M"),
			currency: "gold",
			requiredLevel: 70,
		},
	},
	{
		// rank 16
		currencyMultiplier: 1.8,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("750M"),
			currency: "gold",
			requiredLevel: 80,
		},
	},
	{
		// rank 17
		currencyMultiplier: 1.9,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("1.5B"),
			currency: "gold",
			requiredLevel: 90,
		},
	},
	{
		// rank 18
		currencyMultiplier: 2,
		cost: {
			amount: twoDpAbbreviator.stringToNumber("5B"),
			currency: "gold",
			requiredLevel: 100,
		},
	},
];
