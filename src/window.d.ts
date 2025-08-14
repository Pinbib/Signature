declare global {
	interface Window {
		SIGNATURE: {
			DEV_MODE: boolean;
		}
	}
}

window.SIGNATURE = {
	DEV_MODE: false
};

export {};