// todo: make description
export default abstract class Plugin {
	readonly abstract modules: Record<string, () => Record<string, unknown>>;

	public abstract define(modules: Record<string, Record<string, unknown>>): Record<string, unknown>;
}