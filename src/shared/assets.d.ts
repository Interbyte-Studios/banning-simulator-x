declare namespace assetIds {
	const images: {
		currencies: {
			gold: string;
		};
		backgrounds: {
			light: {
				AutoHatchBG: string;
				EggPetDisplay: string;
				PetBackground: string;
			};
			dark: {
				EggPetDisplay: string;
				PetBackground: string;
				AutoHatchBG: string;
			};
		};
		buttons: {
			light: {
				specialized: {
					openEgg: {
						OpenEggSelected: string;
						OpenEgg: string;
					};
				};
				templates: {
					rectangular: {
						RectangularButtonWarning: string;
						RectangularButton: string;
						RectangularButtonConfirmation: string;
					};
					square: {
						SquareButton: string;
						SquareButtonConfirmation: string;
						SquareButtonWarning: string;
					};
				};
			};
			dark: {
				specialized: {
					openEgg: {
						OpenEggSelected: string;
						OpenEgg: string;
					};
				};
				templates: {
					rectangular: {
						RectangularButton: string;
						RectangularButtonConfirmation: string;
						RectangularButtonWarning: string;
					};
					square: {
						SquareButtonConfirmation: string;
						SquareButton: string;
						SquareButtonWarning: string;
					};
				};
			};
		};
	};
}

export = assetIds;
