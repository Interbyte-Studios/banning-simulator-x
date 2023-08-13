import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { resetBans } from "shared/rodux/bans";
import { awardCurrency } from "shared/rodux/currencies";
import {
	claimRebirth,
	purchaseAdditionalEggsUpgrade,
	purchaseAdditionalPetsUpgrade,
	purchaseCurrencyUpgrade,
	purchaseExtraLuckUpgrade,
	purchaseFastHatchUpgrade,
	purchaseMagicEggsUpgrade,
	purchaseTeleportUpgrade,
} from "shared/rodux/rebirths";

const namespace = remotes.Server.GetNamespace("rebirth");

namespace.Get("rebirth").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();

		const currentRebirth = currentState.rebirths.rebirth;
		const nextRebirth = currentRebirth + 1;
		const cost = nextRebirth > 1 ? nextRebirth ** 5 : 10;
		if (currentState.bans.bans < cost) {
			return;
		}

		const reward = 500 * nextRebirth;
		const gemMultiplier = reward * currentState.rebirths.currencyMultipliers.gems * 0.3;

		store.dispatch(claimRebirth());
		store.dispatch(awardCurrency("gems", reward + gemMultiplier));
		store.dispatch(resetBans());
	}),
);

namespace.Get("purchaseMagicEggs").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();
		const cost =
			currentState.rebirths.magicEggUpgrades === 0 ? 5_000 : 5_000 + 5_000 * currentState.rebirths.magicEggUpgrades;

		if (currentState.rebirths.magicEggUpgrades >= 5) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseMagicEggsUpgrade());
		store.dispatch(awardCurrency("gems", -cost));
	}),
);

namespace.Get("purchaseAdditionalEggs").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();
		const cost =
			currentState.rebirths.additionalEggs === 0 ? 15_000 : 15_000 + 15_000 * currentState.rebirths.additionalEggs;

		if (currentState.rebirths.additionalEggs >= 2) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseAdditionalEggsUpgrade());
		store.dispatch(awardCurrency("gems", -cost));
	}),
);

namespace.Get("purchaseAdditionalPets").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();
		const cost =
			currentState.rebirths.additionalPets === 0 ? 15_000 : 15_000 + 15_000 * currentState.rebirths.additionalPets;

		if (currentState.rebirths.additionalPets >= 4) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseAdditionalPetsUpgrade());
		store.dispatch(awardCurrency("gems", -cost));
	}),
);

namespace.Get("purchaseCurrency").Connect(
	withPlayerStore((_, store, currency) => {
		const currentState = store.getState();
		const cost =
			currentState.rebirths.currencyMultipliers[currency] === 0
				? 1_500
				: 1_500 + 1_500 * currentState.rebirths.currencyMultipliers[currency];

		if (currentState.rebirths.currencyMultipliers[currency] >= 10) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseCurrencyUpgrade(currency));
		store.dispatch(awardCurrency("gems", -cost));
	}),
);

namespace.Get("purchaseTeleport").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();
		const cost = 25_000;

		if (currentState.rebirths.teleport) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseTeleportUpgrade());
		store.dispatch(awardCurrency("gems", -cost));
	}),
);

namespace.Get("purchaseFastHatch").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();
		const cost = 25_000;

		if (currentState.rebirths.fastHatch) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseFastHatchUpgrade());
		store.dispatch(awardCurrency("gems", -cost));
	}),
);

namespace.Get("purchaseExtraLuck").Connect(
	withPlayerStore((_, store) => {
		const currentState = store.getState();
		const cost = 25_000;

		if (currentState.rebirths.extraLuck) {
			return;
		}

		if (currentState.currencies.gems < cost) {
			return;
		}

		store.dispatch(purchaseExtraLuckUpgrade());
		store.dispatch(awardCurrency("gems", -cost));
	}),
);
