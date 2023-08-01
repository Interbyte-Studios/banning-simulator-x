import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import {
	uiClaimButtonStrokeColor,
	uiDarkStrokeColor,
	uiHeaderStrokeColor,
	uiTextStrokeColor,
} from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getPetDecal } from "client/util/getPetDecal";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { PET_QUEST_DEVPRODUCT, PET_QUEST_PET_ID } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { PetQuestState } from "shared/rodux/petQuest";

interface PetQuestProps extends PetQuestMappedProps {
	hideMenu: () => void;
}

interface PetQuestMappedProps {
	petQuest: PetQuestState;
}

/**
 * Maps the rodux store state to the props of the component.
 *
 * @param state - The rodux store state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): PetQuestMappedProps => {
	return {
		petQuest: state.petQuests,
	};
};

export const PetQuest = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetQuestProps, { useState, useEffect, useContext }) => {
		const [hasClaimed, setHasClaimed] = useState(false);
		const [timePlayed, setTimePlayed] = useState(0);
		const [bans, setBans] = useState(0);
		useEffect(() => {
			if (props.petQuest.includes(PET_QUEST_PET_ID)) {
				setHasClaimed(true);
			}

			const playerTimePlayed = Players.LocalPlayer.GetAttribute("petQuestTime") as number;
			setTimePlayed(playerTimePlayed ?? 0);

			const playerBans = Players.LocalPlayer.GetAttribute("petQuestBan") as number;
			setBans(playerBans ?? 0);

			const attributeChanged = Players.LocalPlayer.AttributeChanged.Connect((attribute) => {
				if (attribute === "petQuestTime") {
					setTimePlayed(Players.LocalPlayer.GetAttribute("petQuestTime") as number);
				}

				if (attribute === "petQuestBan") {
					setBans(Players.LocalPlayer.GetAttribute("petQuestBan") as number);
				}
			});
			return (): void => attributeChanged.Disconnect();
		}, [hasClaimed, timePlayed, bans]);

		const { claimPetFromQuest } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.2, 0.417),
					Image: assetIds.images.ui.settings.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={0.875} />
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(2, 114, 174)}
					Position={UDim2.fromScale(0.21, 0.35)}
					Size={UDim2.fromScale(0.37, 0.33)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Image: getPetDecal(PET_QUEST_PET_ID, "regular"),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
				</BaseFrame>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.7, 0.234),
						Size: UDim2.fromScale(0.552, 0.09),
						Text: "Bio Destroyer",
						TextColor3: Color3.fromRGB(13, 255, 0),
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(7, 111, 0) } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.7, 0.311),
						Size: UDim2.fromScale(0.552, 0.067),
						Text: "Secret",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				>
					<RarityGradient Rarity={"Secret"} />
				</StrokeTextLabel>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.624, 0.389),
						Size: UDim2.fromScale(0.278, 0.067),
						Text: "Complete",
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.836, 0.394),
						Size: UDim2.fromScale(0.145, 0.053),
						Text: "both",
						TextColor3: Color3.fromRGB(13, 255, 0),
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(7, 111, 0) } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.7, 0.477),
						Size: UDim2.fromScale(0.552, 0.109),
						Text: "objectives to unlock a limited OP pet!",
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.49, 0.08),
						Size: UDim2.fromScale(0.425, 0.13),
						Text: "Pet Quest",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.237, 1.099),
						Image: assetIds.images.ui.index.Claim,
						ImageColor3:
							hasClaimed || timePlayed < 3600 || bans < 250
								? Color3.fromRGB(177, 177, 177)
								: Color3.fromRGB(255, 255, 255),
					}}
					size={{ minSize: 0.325, maxSize: 0.375 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							if (hasClaimed) {
								addAnnouncement(`You have already claimed the pet..`, AnnouncementType.Error);
								return;
							}
							if (timePlayed < 3600) {
								addAnnouncement(`You haven't played long enough.`, AnnouncementType.Error);
								return;
							}
							if (bans < 250) {
								addAnnouncement(`You haven't banned enough NPCs.`, AnnouncementType.Error);
								return;
							}

							claimPetFromQuest.SendToServer();
							addAnnouncement(`You claimed the pet!.`, AnnouncementType.Announcement);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Claim",
							TextColor3:
								hasClaimed || timePlayed < 3600 || bans < 250
									? Color3.fromRGB(177, 177, 177)
									: Color3.fromRGB(255, 255, 255),
						}}
						stroke={{
							native: {
								Thickness: 2,
								Color:
									hasClaimed || timePlayed < 3600 || bans < 250
										? Color3.fromRGB(17, 150, 55)
										: uiClaimButtonStrokeColor,
							},
						}}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.763, 1.099),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.325, maxSize: 0.375 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(Players.LocalPlayer, PET_QUEST_DEVPRODUCT);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "R$1499",
						}}
						stroke={{
							native: {
								Thickness: 2,
								Color: uiClaimButtonStrokeColor,
							},
						}}
					/>
				</SpringImageButton>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(12, 134, 211)}
					Position={UDim2.fromScale(0.5, 0.698)}
					Size={UDim2.fromScale(0.951, 0.102)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

					<BaseFrame
						AnchorPoint={new Vector2(0, 0)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(118, 255, 97)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(hasClaimed ? 1 : timePlayed / 3600 > 1 ? 1 : timePlayed / 3600, 1)}
					>
						<uicorner CornerRadius={new UDim(0.2, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
					</BaseFrame>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Text: `${hasClaimed ? 60 : timePlayed / 3600 > 1 ? 60 : math.floor(timePlayed / 60)} / ${3600 / 60}`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(67, 67, 67) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, -0.484),
							Size: UDim2.fromScale(1, 0.617),
							Text: `Play for 60 minutes!`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(67, 67, 67) } }}
					/>
				</BaseFrame>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(12, 134, 211)}
					Position={UDim2.fromScale(0.5, 0.904)}
					Size={UDim2.fromScale(0.951, 0.102)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

					<BaseFrame
						AnchorPoint={new Vector2(0, 0)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(118, 255, 97)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(hasClaimed ? 1 : bans > 250 ? 1 : bans / 250, 1)}
					>
						<uicorner CornerRadius={new UDim(0.2, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
					</BaseFrame>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Text: `${hasClaimed ? 250 : bans > 250 ? 250 : bans} / 250`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(67, 67, 67) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, -0.484),
							Size: UDim2.fromScale(1, 0.617),
							Text: `Ban 250 Npcs!`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(67, 67, 67) } }}
					/>
				</BaseFrame>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.488, -0.055),
						Size: UDim2.fromScale(0.95, 0.107),
						Text: `Leaving will reset progress!`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(67, 67, 67) } }}
				/>
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.095)}
					minimizedSize={0.1}
					maximizedSize={0.15}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
		);
	}),
);
