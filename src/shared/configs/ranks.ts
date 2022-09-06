import { Currency } from "./currencies";

interface Rank {
	amount: number;
	currency: Currency;
	gradient: {
		beginningColor: Color3;
		endingColor: Color3;
	};
	name: string;
	requiredExperience: number;
}

export const RANKS: Array<Rank> = [
	{
		// rank 1
		amount: 1_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(92, 51, 32),
			endingColor: Color3.fromRGB(161, 108, 78),
		},
		name: "Bronze I",
		requiredExperience: 0,
	},
	{
		// rank 2
		amount: 2_500,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(92, 51, 32),
			endingColor: Color3.fromRGB(161, 108, 78),
		},
		name: "Bronze II",
		requiredExperience: 350,
	},
	{
		// rank 3
		amount: 7_500,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(92, 51, 32),
			endingColor: Color3.fromRGB(161, 108, 78),
		},
		name: "Bronze III",
		requiredExperience: 750,
	},
	{
		// rank 4
		amount: 12_500,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(92, 51, 32),
			endingColor: Color3.fromRGB(161, 108, 78),
		},
		name: "Bronze IV",
		requiredExperience: 1_100,
	},
	{
		// rank 5
		amount: 20_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(86, 100, 107),
			endingColor: Color3.fromRGB(151, 161, 167),
		},
		name: "Silver I",
		requiredExperience: 1_800,
	},
	{
		// rank 6
		amount: 30_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(86, 100, 107),
			endingColor: Color3.fromRGB(151, 161, 167),
		},
		name: "Silver II",
		requiredExperience: 2_250,
	},
	{
		// rank 7
		amount: 75_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(86, 100, 107),
			endingColor: Color3.fromRGB(151, 161, 167),
		},
		name: "Silver III",
		requiredExperience: 2_900,
	},
	{
		// rank 8
		amount: 150_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(86, 100, 107),
			endingColor: Color3.fromRGB(151, 161, 167),
		},
		name: "Silver IV",
		requiredExperience: 3_750,
	},
	{
		// rank 9
		amount: 375_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(124, 70, 21),
			endingColor: Color3.fromRGB(179, 134, 61),
		},
		name: "Gold I",
		requiredExperience: 7_000,
	},
	{
		// rank 10
		amount: 750_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(124, 70, 21),
			endingColor: Color3.fromRGB(179, 134, 61),
		},
		name: "Gold II",
		requiredExperience: 9_000,
	},
	{
		// rank 11
		amount: 1_875_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(124, 70, 21),
			endingColor: Color3.fromRGB(179, 134, 61),
		},
		name: "Gold III",
		requiredExperience: 21_000,
	},
	{
		// rank 12
		amount: 3_750_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(124, 70, 21),
			endingColor: Color3.fromRGB(179, 134, 61),
		},
		name: "Gold IV",
		requiredExperience: 37_500,
	},
	{
		// rank 13
		amount: 11_250_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(52, 94, 205),
			endingColor: Color3.fromRGB(131, 161, 232),
		},
		name: "Diamond I",
		requiredExperience: 125_000,
	},
	{
		// rank 14
		amount: 22_500_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(52, 94, 205),
			endingColor: Color3.fromRGB(131, 161, 232),
		},
		name: "Diamond II",
		requiredExperience: 262_500,
	},
	{
		// rank 15
		amount: 135_000_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(52, 94, 205),
			endingColor: Color3.fromRGB(131, 161, 232),
		},
		name: "Diamond III",
		requiredExperience: 1_237_500,
	},
	{
		// rank 16
		amount: 750_000_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(52, 94, 205),
			endingColor: Color3.fromRGB(131, 161, 232),
		},
		name: "Diamond IV",
		requiredExperience: 7_350_000,
	},
	{
		// rank 17
		amount: 1_500_000_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(116, 24, 25),
			endingColor: Color3.fromRGB(175, 65, 65),
		},
		name: "Ruby I",
		requiredExperience: 37_500_000,
	},
	{
		// rank 18
		amount: 5_000_000_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(116, 24, 25),
			endingColor: Color3.fromRGB(175, 65, 65),
		},
		name: "Ruby II",
		requiredExperience: 185_625_000,
	},
	{
		// rank 19
		amount: 10_000_000_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(116, 24, 25),
			endingColor: Color3.fromRGB(175, 65, 65),
		},
		name: "Ruby III",
		requiredExperience: 965_250_000,
	},
	{
		// rank 20
		amount: 25_000_000_000,
		currency: "coins",
		gradient: {
			beginningColor: Color3.fromRGB(116, 24, 25),
			endingColor: Color3.fromRGB(175, 65, 65),
		},
		name: "Ruby IV",
		requiredExperience: 6_000_000_000,
	},
];
