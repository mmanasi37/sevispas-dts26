import {
	DummyDriver,
	SqliteAdapter,
	SqliteIntrospector,
	SqliteQueryCompiler,
} from 'kysely'
import { defineConfig } from 'kysely-ctl'

export default defineConfig({
	// replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
	dialect: {
		createAdapter() {
			return new SqliteAdapter()
		},
		createDriver() {
			return new DummyDriver()
		},
		createIntrospector(db) {
			return new SqliteIntrospector(db)
		},
		createQueryCompiler() {
			return new SqliteQueryCompiler()
		},
	},
	migrations: {
		migrationFolder: "../src/database/migrations",
	},
	//   plugins: [],
	seeds: {
		seedFolder: "../src/database/seeds",
	}
	// destroyOnExit, // optional. dictates whether the (resolved) `kysely` instance should be destroyed when a command is finished executing. default is `true`.
	// dialect, // a `Kysely` dialect instance OR the name of an underlying driver library (e.g. `'pg'`).
	// dialectConfig, // optional. when `dialect` is the name of an underlying driver library, `dialectConfig` is the options passed to the Kysely dialect that matches that library.
	// migrations: { // optional.
	// 	allowJS, // optional. controls whether `.js`, `.cjs` or `.mjs` migrations are allowed. default is `false`.
	// 	getMigrationPrefix, // optional. a function that returns a migration prefix. affects `migrate make` command. default is `() => ${Date.now()}_`.
	// 	migrationFolder, // optional. path to where migration files are located. default is a folder named "migrations" next to the config file/folder.
	// 	migrator, // optional. a `Kysely` migrator instance factory of shape `(db: Kysely<any>) => Migrator | Promise<Migrator>`. default is `Kysely`'s `Migrator`.
	// 	provider, // optional. a `Kysely` migration provider instance. default is `kysely-ctl`'s `TSFileMigrationProvider`.
	// },
	// plugins, // optional. `Kysely` plugins list. default is `[]`.
	// seeds: { // optional.
	// 	allowJS, // optional. controls whether `.js`, `.cjs` or `.mjs` seeds are allowed. default is `false`.
	// 	getSeedPrefix, // optional. a function that returns a seed prefix. affects `seed make` command. default is `() => ${Date.now()}_`.
	// 	provider, // optional. a seed provider instance. default is `kysely-ctl`'s `FileSeedProvider`.
	// 	seeder, // optional. a seeder instance factory of shape `(db: Kysely<any>) => Seeder | Promise<Seeder>`. default is `kysely-ctl`'s `Seeder`.
	// 	seedFolder, // optional. path to where seed files are located. default is a folder named "seeds" next to the config file/folder.
	// }
});