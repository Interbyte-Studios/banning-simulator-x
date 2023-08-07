import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, Workspace } from "@rbxts/services";
import {
	uiClaimButtonStrokeColor,
	uiHeaderStrokeColor,
	uiOffButtonStrokeColor,
	uiTextStrokeColor,
} from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getHumanoidRootPart } from "client/util/getHumanoidRoot";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TELEPORTATIONS } from "shared/configs/game";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { isStarterZone, zones } from "shared/configs/zones";
import { PurchaseWorldFailKind } from "shared/remotes/purchaseWorld";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface WorldsControlMappedProps {
	worldsState: WorldsState;
	currencies: CurrenciesState;
	rank: RankState;
}

/**
 * @param state The rodux state.
 * @returns The mapped state.
 */
const mapStateToProps = (state: StoreState): WorldsControlMappedProps => {
	return {
		worldsState: state.worlds,
		currencies: state.currencies,
		rank: state.rank,
	};
};

export const WorldsControl = RoactRodux.connect(mapStateToProps)(
	hooks((props: WorldsControlMappedProps, { useState, useContext }) => {
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const { purchaseWorld } = useContext(remoteContext);

		const [displayWorldPurchase, setDisplayWorldPurchase] = useState<Exclude<WorldName, "Ban Land"> | undefined>(
			undefined,
		);

		const portals = Workspace.interactions.portals;
		const banLandPortals = portals["Ban Land"].GetChildren().map((interaction) => {
			if (!interaction.IsA("BasePart")) {
				return <></>;
			}

			return (
				<>
					<billboardgui
						Active={true}
						AlwaysOnTop={true}
						LightInfluence={0}
						Size={UDim2.fromScale(12, 10)}
						StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
						MaxDistance={80}
						Adornee={interaction}
					>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(1.5, 0.25),
								FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
								Text: "Ban Land",
								TextColor3: Color3.fromRGB(255, 255, 255),
							}}
							stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
						>
							<uigradient
								Rotation={90}
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, Color3.fromRGB(153, 247, 140)),
										new ColorSequenceKeypoint(1, Color3.fromRGB(255, 222, 115)),
									])
								}
							/>
						</StrokeTextLabel>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.7),
								Size: UDim2.fromScale(1.1, 0.2),
								FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
								Text: "The land of bans...",
							}}
							stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
						/>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.5, 0.95),
								Image: assetIds.images.ui.index.Claim,
							}}
							size={{ minSize: 0.4, maxSize: 0.5 }}
							events={{
								/**
								 *
								 */
								Activated: (): void => {
									playSFX(UIEngagement.MajorEngagement);
									const playerRoot = getHumanoidRootPart(Players.LocalPlayer);
									if (playerRoot === undefined) {
										return;
									}

									playerRoot.CFrame = new CFrame(TELEPORTATIONS.ZONES.Forest);
								},
							}}
						>
							<StrokeTextLabel
								native={{
									Size: UDim2.fromScale(0.8, 0.8),
									Text: "Teleport",
								}}
								stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
							/>
							<uiaspectratioconstraint AspectRatio={2} />
						</SpringImageButton>
					</billboardgui>
				</>
			);
		});

		const cyberCityPortals = portals["Cyber Cities"].GetChildren().map((interaction) => {
			if (!interaction.IsA("BasePart")) {
				return <></>;
			}

			const ownsCyber = props.worldsState.find((storedWorld) => storedWorld.name === "Cyber Cities") !== undefined;

			return (
				<>
					<billboardgui
						Active={true}
						AlwaysOnTop={true}
						LightInfluence={0}
						Size={UDim2.fromScale(12, 10)}
						StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
						MaxDistance={80}
						Adornee={interaction}
					>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(1.5, 0.25),
								FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
								Text: "Cyber Cities",
								TextColor3: Color3.fromRGB(255, 255, 255),
							}}
							stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
						>
							<uigradient
								Rotation={90}
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, Color3.fromRGB(255, 8, 255)),
										new ColorSequenceKeypoint(1, Color3.fromRGB(46, 41, 247)),
									])
								}
							/>
						</StrokeTextLabel>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.7),
								Size: UDim2.fromScale(1.1, 0.2),
								FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
								Text: "The City of Mayhem",
							}}
							stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
						/>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.5, 0.95),
								Image: assetIds.images.ui.index.Claim,
							}}
							size={{ minSize: 0.4, maxSize: 0.5 }}
							events={{
								/**
								 *
								 */
								Activated: (): void => {
									playSFX(UIEngagement.MajorEngagement);
									const playerRoot = getHumanoidRootPart(Players.LocalPlayer);
									if (playerRoot === undefined) {
										return;
									}

									if (props.worldsState.find((storedWorld) => storedWorld.name === "Cyber Cities") !== undefined) {
										playerRoot.CFrame = new CFrame(TELEPORTATIONS.ZONES["Neon City"]);
									} else {
										setDisplayWorldPurchase("Cyber Cities");
									}
								},
							}}
						>
							<StrokeTextLabel
								native={{
									Size: UDim2.fromScale(0.8, 0.8),
									Text: ownsCyber ? "Teleport" : "Buy",
								}}
								stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
							/>
							<uiaspectratioconstraint AspectRatio={2} />
						</SpringImageButton>
					</billboardgui>
				</>
			);
		});

		if (displayWorldPurchase === undefined) {
			return (
				<>
					{banLandPortals}
					{cyberCityPortals}
				</>
			);
		}

		const worldData = WORLDS[displayWorldPurchase];
		if (worldData.cost === undefined) {
			return (
				<>
					{banLandPortals}
					{cyberCityPortals}
				</>
			);
		}

		const starterZone = Object.entries(zones).find(
			(zoneData) => zoneData[1].worldParent === displayWorldPurchase && isStarterZone(zoneData[0]),
		);
		if (starterZone === undefined) {
			return (
				<>
					{banLandPortals}
					{cyberCityPortals}
				</>
			);
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.4, 0.36),
					Image: assetIds.images.ui.zones.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.8} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.115),
						Size: UDim2.fromScale(0.385, 0.175),
						Text: "World Purchase",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.4),
						Size: UDim2.fromScale(0.9, 0.275),
						Text: `Would you like to purchase ${displayWorldPurchase}?`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.65, 0.635),
						Size: UDim2.fromScale(0.3, 0.15),
						Text: twoDpAbbreviator.numberToString(worldData.cost.amount),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{
						native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) },
						currencyGradient: worldData.cost.currencyType,
					}}
				>
					<CurrencyIcon
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(-0.2, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						currency={worldData.cost.currencyType}
					/>
					<RankIcon
						position={UDim2.fromScale(-0.475, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						rank={worldData.cost.requiredRank}
					/>
				</StrokeTextLabel>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.75, 0.85),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.175, maxSize: 0.2 }}
					events={{
						/**
						 *
						 */
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MajorEngagement);

							if (props.currencies[worldData.cost.currencyType] < worldData.cost.amount) {
								addAnnouncement(`You don't have enough to purchase "${displayWorldPurchase}".`, AnnouncementType.Error);
								return;
							}

							const requestWorldPurchase = await purchaseWorld.CallServerAsync(displayWorldPurchase, "Neon City");
							if (requestWorldPurchase.success === true) {
								addAnnouncement(`You have purchased the "${displayWorldPurchase}".`, AnnouncementType.Announcement);
								setDisplayWorldPurchase(undefined);
								return;
							} else {
								switch (requestWorldPurchase.reason) {
									case PurchaseWorldFailKind.InternalError: {
										addAnnouncement(
											`There was an error while purchasing "${displayWorldPurchase}".`,
											AnnouncementType.Error,
										);
										return;
									}
									case PurchaseWorldFailKind.NotEnoughCurrency: {
										addAnnouncement(
											`You don't have enough to purchase "${displayWorldPurchase}".`,
											AnnouncementType.Error,
										);
										return;
									}
									case PurchaseWorldFailKind.NotRequiredRank: {
										addAnnouncement(
											`You aren't a high enough rank to purchase "${displayWorldPurchase}".`,
											AnnouncementType.Error,
										);
										return;
									}
									case PurchaseWorldFailKind.NonlinearProgression: {
										addAnnouncement(
											`You don't meet the requirements to purchase "${displayWorldPurchase}".`,
											AnnouncementType.Error,
										);
										return;
									}
								}
							}
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Purchase",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.25, 0.85),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.175, maxSize: 0.2 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							setDisplayWorldPurchase(undefined);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.85, 0.6),
							Text: "Cancel",
						}}
						stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</ImageLabel>
		);
	}),
);
