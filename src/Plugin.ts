export default abstract class Plugin {
	/**
	 * Modules are mini plugins that are required for the plugin to work, they are processed and stored before the plugin itself is installed and stored in a safe place.
	 */
	readonly abstract modules: Record<string, () => Record<string, unknown>>;

	/**
	 * The function returns an object that will be installed as a plugin in Signature.$
	 * @param modules
	 * @returns {Record<string, unknown>} The object that will be installed as a plugin
	 */
	public abstract define(modules: Record<string, Record<string, unknown>>): Record<string, unknown>;
}