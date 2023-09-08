interface RaycastHitBoxConstructor {
	new (model?: Instance): RaycastHitBox;
	GetHitbox(model: Instance): RaycastHitBox | undefined;
}

interface RaycastHitBox {
	// methods
	SetPoints(instance: BasePart | Bone, vectorPoints: Array<Vector3>, group?: string): void;
	RemovePoints(instance: BasePart | Bone, vectorPoints: Array<Vector3>): void;
	LinkAttachments(instance: BasePart | Bone, vectorPoints: Array<Vector3>): void;
	UnlinkAttachments(instance: BasePart | Bone, vectorPoints: Array<Vector3>): void;
	HitStart(seconds?: number): void;
	HitStop(): void;

	// connections
	OnHit: RBXScriptSignal<
		(part: Instance, humanoid: Humanoid, raycastResults: Array<RaycastResult>, group: string) => void
	>;
	OnUpdate: RBXScriptSignal<(position: Vector3) => void>;

	// properties
	RaycastParams: RaycastParams;
	Visualizer: boolean;
	Debuglog: boolean;
	DetectionMode: number; // number [1 - 3] and defaults to 1
}

declare const Hitbox: RaycastHitBoxConstructor;
export = Hitbox;
