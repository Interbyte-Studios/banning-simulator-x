interface ServerStorage extends Instance {
	timeTrials: Folder & {
		map: Model;
		startCreationLocation: Part;
	};
}
