import { animateEggHatch } from "client/modules/eggs/hatchEgg";
import { remotes } from "shared/remotes";

const marketplaceRemotes = remotes.Client.GetNamespace("eggs");
const hatchSingleExclusivePet = marketplaceRemotes.Get("hatchSingleExclusiveEgg");
const hatchTripleExclusivePet = marketplaceRemotes.Get("hatchTripleExclusiveEgg");

hatchSingleExclusivePet.Connect((eggName, petId) => {
	debug.setmemorycategory("limitedPets");
	animateEggHatch(
		eggName,
		false,
		[
			{
				id: petId,
				variant: "regular",
				tradeLocked: false,
				autoDeleted: false,
				guid: "exclusive pet",
				magicPet: false,
			},
		],
		false,
	);
});

hatchTripleExclusivePet.Connect((eggName, petIds) => {
	debug.setmemorycategory("limitedPets");
	animateEggHatch(
		eggName,
		false,
		petIds.map((petId) => {
			return {
				id: petId,
				variant: "regular",
				tradeLocked: false,
				autoDeleted: false,
				guid: "exclusive pet",
				magicPet: false,
			};
		}),
		false,
	);
});
