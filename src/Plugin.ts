export default abstract class Plugin {
	readonly abstract modules: Record<string, () => Record<string, unknown>>;

	public abstract define(directives: Record<string, Record<string, unknown>>): Record<string, unknown>;
}