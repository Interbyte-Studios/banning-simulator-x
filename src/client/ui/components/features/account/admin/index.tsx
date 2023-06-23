// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { retrieveStore } from "client/clientStores";
import { hooks } from "client/ui/hooks";

import { FullComponentHeader } from "../util/fullComponentHeader";
import { DisplayAdminOptions } from "./displayOptions";
import { KickPlayer } from "./kickPlayer";
import { ModifyCurrency } from "./modifyCurrency";
import { ModifyPetLevel } from "./modifyPetLevel";
import { ModifyRank } from "./modifyRank";
import { ModifyTalismanPhase } from "./modifyTalismanPhase";
import { ModifyWeaponLevel } from "./modifyWeaponLevel";
import { ShutdownServer } from "./shutdownServer";
import { SpawnPetAdmin } from "./spawnPet";

interface AdminProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

export type ValidAdminOption =
	| "SpawnPet"
	| "ModifyPetLevel"
	| "ModifyWeaponLevel"
	| "ModifyTalismanLevel"
	| "ModifyRank"
	| "ModifyCurrency"
	| "Shutdown"
	| "Kick";

/**
 * An administrative UI only accessible to admin ranks in the Interbyte system.
 */
export const Admin = hooks((props: AdminProps, hooks) => {
	const { useState } = hooks;

	const playerStore = retrieveStore(props.playerViewing);
	if (playerStore === undefined) {
		return (
			<FullComponentHeader
				storeFound={true}
				headerText={`Error Loading Admin Options (E: 1)`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
		);
	}

	const [activeAction, setActiveAction] = useState<ValidAdminOption | undefined>(undefined);

	if (activeAction === undefined) {
		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Admin Options for ${props.playerViewing.Name}`}
					returnToSelection={props.returnToSelection}
					displayReturn={true}
				/>
				<DisplayAdminOptions setActiveAction={(action: ValidAdminOption): void => setActiveAction(action)} />
			</>
		);
	} else if (activeAction === "SpawnPet") {
		return (
			<SpawnPetAdmin playerViewing={props.playerViewing} setActiveAction={(): void => setActiveAction(undefined)} />
		);
	} else if (activeAction === "ModifyPetLevel") {
		return (
			<ModifyPetLevel playerViewing={props.playerViewing} setActiveAction={(): void => setActiveAction(undefined)} />
		);
	} else if (activeAction === "ModifyWeaponLevel") {
		return (
			<ModifyWeaponLevel playerViewing={props.playerViewing} setActiveAction={(): void => setActiveAction(undefined)} />
		);
	} else if (activeAction === "ModifyTalismanLevel") {
		return (
			<ModifyTalismanPhase
				playerViewing={props.playerViewing}
				setActiveAction={(): void => setActiveAction(undefined)}
			/>
		);
	} else if (activeAction === "ModifyRank") {
		return <ModifyRank playerViewing={props.playerViewing} setActiveAction={(): void => setActiveAction(undefined)} />;
	} else if (activeAction === "ModifyCurrency") {
		return (
			<ModifyCurrency playerViewing={props.playerViewing} setActiveAction={(): void => setActiveAction(undefined)} />
		);
	} else if (activeAction === "Kick") {
		return <KickPlayer playerViewing={props.playerViewing} setActiveAction={(): void => setActiveAction(undefined)} />;
	} else if (activeAction === "Shutdown") {
		return <ShutdownServer setActiveAction={(): void => setActiveAction(undefined)} />;
	}

	return (
		<FullComponentHeader
			storeFound={true}
			headerText={`Error Loading Admin Options (E: 2)`}
			returnToSelection={props.returnToSelection}
			displayReturn={true}
		/>
	);
});
