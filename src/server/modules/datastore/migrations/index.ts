import { t } from "@rbxts/t";

import { ProfileState } from "../serde";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const migrations =
	script
		.GetChildren()
		.filter((file): file is ModuleScript => file.IsA("ModuleScript"))
		.map((migrator) => {
			const migrationHandler = require(migrator);
			assert(t.callback(migrationHandler), `Expected ${migrator.GetFullName()} to be a function handler`);

			const migratorVersion = tonumber(migrator.Name);
			assert(migratorVersion, `${migrator.GetFullName()} was not a numeric data version`);

			return {
				version: migratorVersion,
				migrator: migrationHandler,
			};
		}) ?? [];

// we need to run migrations in order of their numeric values
table.sort(migrations, (a, b) => a.version < b.version);

/**
 * Runs the relevant migrations that are needed for a given state.
 *
 * @param state The outdated state that needs migrating.
 * @returns The migrated state.
 */
export function runMigrations(state: ProfileState): ProfileState {
	// if this is the update that released the migration functionality
	// then we want to default to a data version of 1
	migrations
		.filter((migration) => migration.version > state.dataVersion)
		.forEach((migrator) => {
			state = migrator.migrator(state) as ProfileState;
			// update the version of the state
			state.dataVersion = migrator.version;
		});

	return state;
}
