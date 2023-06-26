import { GameAnalytics } from "@rbxts/gameanalytics";
import { GAME_VERSION } from "shared/configs/game";

GameAnalytics.initialize({
	gameKey: "eda10d18acc1c3c2b5237c547e6471fb",
	secretKey: "69d5ee978e684096507826636a63544bc2b5ea75",
	build: GAME_VERSION,
	enableDebugLog: false,
	enableInfoLog: false,
});
