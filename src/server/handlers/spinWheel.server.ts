import { remotes } from "shared/remotes";

remotes.Server.Create("spinWheel").Connect(() => {
	return new Random().NextInteger(1, 9);
});
