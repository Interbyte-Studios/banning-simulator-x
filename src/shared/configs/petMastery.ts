import { ValidBoostTime } from "shared/rodux/boosts";

import { BoostProduct } from "./game";
import { Rarity } from "./rarities";

export const PET_MASTERY_REQUIREMENTS = {
	Basic: {
		regular: {
			hatch: 80,
			maxLevel: 5,
			fuse: 0,
		},
		void: {
			hatch: 80,
			maxLevel: 5,
			fuse: 5,
		},
		radiant: {
			hatch: 0,
			maxLevel: 5,
			fuse: 5,
		},
	},
	Ordinary: {
		regular: {
			hatch: 65,
			maxLevel: 5,
			fuse: 0,
		},
		void: {
			hatch: 65,
			maxLevel: 5,
			fuse: 4,
		},
		radiant: {
			hatch: 0,
			maxLevel: 5,
			fuse: 4,
		},
	},
	Rare: {
		regular: {
			hatch: 50,
			maxLevel: 4,
			fuse: 0,
		},
		void: {
			hatch: 50,
			maxLevel: 4,
			fuse: 4,
		},
		radiant: {
			hatch: 0,
			maxLevel: 4,
			fuse: 4,
		},
	},
	Epic: {
		regular: {
			hatch: 35,
			maxLevel: 3,
			fuse: 0,
		},
		void: {
			hatch: 35,
			maxLevel: 3,
			fuse: 3,
		},
		radiant: {
			hatch: 0,
			maxLevel: 3,
			fuse: 2,
		},
	},
	Legendary: {
		regular: {
			hatch: 20,
			maxLevel: 3,
			fuse: 0,
		},
		void: {
			hatch: 20,
			maxLevel: 3,
			fuse: 2,
		},
		radiant: {
			hatch: 0,
			maxLevel: 3,
			fuse: 1,
		},
	},
	Primordial: {
		regular: {
			hatch: 1,
			maxLevel: 1,
			fuse: 0,
		},
		void: {
			hatch: 1,
			maxLevel: 1,
			fuse: 1,
		},
		radiant: {
			hatch: 0,
			maxLevel: 1,
			fuse: 1,
		},
	},
	Secret: {
		regular: {
			hatch: 1,
			maxLevel: 1,
			fuse: 0,
		},
		void: {
			hatch: 1,
			maxLevel: 1,
			fuse: 1,
		},
		radiant: {
			hatch: 0,
			maxLevel: 1,
			fuse: 1,
		},
	},
	Exclusive: {
		regular: {
			hatch: 0,
			maxLevel: 10,
			fuse: 0,
		},
		void: {
			hatch: 0,
			maxLevel: 15,
			fuse: 5,
		},
		radiant: {
			hatch: 0,
			maxLevel: 10,
			fuse: 5,
		},
	},
};

interface Pet_Mastery_Rewards_Def {
	regular: {
		hatch: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
		maxLevel: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
		fuse: undefined;
	};
	void: {
		hatch: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
		maxLevel: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
		fuse: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
	};
	radiant: {
		hatch: undefined;
		maxLevel: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
		fuse: {
			boost: BoostProduct;
			duration: ValidBoostTime;
		};
	};
}

export const PET_MASTERY_REWARDS: { [rarity in Rarity]: Pet_Mastery_Rewards_Def } = {
	Basic: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 15,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 15,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 15,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 15,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 15,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 30,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 30,
			},
		},
	},
	Ordinary: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 15,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 15,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 15,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 15,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 15,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 30,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 30,
			},
		},
	},
	Rare: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 15,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 15,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 15,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 15,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 15,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 30,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 30,
			},
		},
	},
	Epic: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 30,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 30,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 30,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 30,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 30,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 60,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 60,
			},
		},
	},
	Legendary: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 60,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 60,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 60,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 60,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 60,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 60,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 60,
			},
		},
	},
	Primordial: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 120,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 120,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 120,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 120,
			},
		},
	},
	Secret: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 120,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 120,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 120,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 120,
			},
		},
	},
	Exclusive: {
		regular: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 120,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: undefined, // no fuse requirement
		},
		void: {
			hatch: {
				boost: "x2 Hatching Luck",
				duration: 120,
			},
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 120,
			},
		},
		radiant: {
			hatch: undefined, // no hatch requirement
			maxLevel: {
				boost: "x2 Pet Experience",
				duration: 120,
			},
			fuse: {
				boost: "x2 Rank Experience",
				duration: 120,
			},
		},
	},
};
