type Errors = "unknown";

export interface Error {
	id: Errors;
}

export interface UnknownError extends Error {
	id: "unknown";
	from?: string;
}

type ErrorUnion = UnknownError;

export default ErrorUnion;