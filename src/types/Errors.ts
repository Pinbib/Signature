type Errors =
	"unknown"
	| "unknown-from"
	| "element-not-found"
	| "prop-is-required"
	| "unsupported-type-for-property"
	| "invalid-value-for-property"
	| "multiple-root-elements"
	| "ref-collision"
	| "stack-overflow"
	| "render-async-failed";


export {Errors};

export interface error {
	id: Errors;
}

export interface UnknownError extends error {
	id: "unknown";
	err?: Error;
}

export interface UnknownFromError extends error {
	id: "unknown-from";
	from: string;
	err?: Error;
}

export interface ElementNotFoundError extends error {
	id: "element-not-found";
	selector: string;
}

export interface PropIsRequiredError extends error {
	id: "prop-is-required";
	component: string;
	prop: string;
}

export interface UnsupportedTypeForPropertyError extends error {
	id: "unsupported-type-for-property";
	component: string;
	prop: string;
	type: "string" | "number" | "boolean" | "null";
}

export interface InvalidValueForPropertyError extends error {
	id: "invalid-value-for-property";
	component: string;
	prop: string;
	value: string | number | boolean | null;
	attr: string;
}

export interface MultipleRootElementsError extends error {
	id: "multiple-root-elements";
	component: string;
	elements: string;
}

export interface RefCollisionError extends error {
	id: "ref-collision";
	ref: string;
	component: string;
}

export interface StackOverflowError extends error {
	id: "stack-overflow";
	err?: Error;
}

export interface RenderAsyncFailedError extends error {
	id: "render-async-failed";
	component: string;
	err?: Error;
}

type ErrorUnion =
	UnknownError
	| UnknownFromError
	| ElementNotFoundError
	| PropIsRequiredError
	| UnsupportedTypeForPropertyError
	| InvalidValueForPropertyError
	| MultipleRootElementsError
	| RefCollisionError
	| StackOverflowError
	| RenderAsyncFailedError;

export default ErrorUnion;