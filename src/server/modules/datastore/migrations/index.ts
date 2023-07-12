import { deepCopy } from "@rbxts/object-utils";
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
	migrations
		.filter((migration) => migration.version > state.dataVersion)
		.forEach((migrator) => {
			print(`Running migration to version ${migrator.version}`);

			// we deep copy the state so that if the migrator fails, we haven't
			// changed the real state (and can then roll-back)
			state = migrator.migrator(deepCopy(state)) as ProfileState;
			// update the version of the state
			state.dataVersion = migrator.version;
		});

	return state;
}

/**
 * Checks to see if a migrated state has a data version that is within this servers expected data version.
 *
 * @param state The migrated state of the profile.
 * @returns If the profile has the expected data version.
 */
export function hasExpectedDataVersion(state: ProfileState): boolean {
	return state.dataVersion === migrations[migrations.size() - 1].version;
}
