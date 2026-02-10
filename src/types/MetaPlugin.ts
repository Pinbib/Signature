interface MetaPlugin {
	plugin: Record<string, unknown>;
	modules: Record<string, Record<string, unknown>>;
}

export type {MetaPlugin as default};