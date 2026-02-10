import Signature from './Signature.js';

export default function (): Signature {
	return new Signature();
}

export {default as Signature} from './Signature.js';
export {default as Component} from './Component.js';
export {default as Prop} from './Prop.js';
export {default as Library} from './Library.js';
export {default as html, unsafeHTML} from './html.js';
export {default as Plugin} from './Plugin.js';