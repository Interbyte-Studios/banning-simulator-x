interface ServerStorage extends Instance {
	timeTrials: Folder & {
		map: Model & {
			SpawnLocation: SpawnLocation;
		};
		startCreationLocation: Part;
	};
}
