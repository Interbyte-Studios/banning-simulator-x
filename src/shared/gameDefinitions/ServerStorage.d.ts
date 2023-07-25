interface ServerStorage extends Instance {
	timeTrials: Folder & {
		map: Model & {
			SpawnLocation: SpawnLocation;
			npcSpawn: Folder;
			npcs: Folder;
		};
		startCreationLocation: Part;
	};
}
