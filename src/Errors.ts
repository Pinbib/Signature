import {Errors} from "./types/Errors.js";

const errorMessages: Record<Errors, string> = {
	"element-not-found": "Element not found for selector: #selector",
	"prop-is-required": "Property '#prop' in component '#component' is required but not provided.",
	"unsupported-type-for-property": "Unsupported type for property '#prop' in component '#component': #type",
	"invalid-value-for-property": "Invalid value for property '#prop' in component '#component': #value (value: #attr)",
	"multiple-root-elements": "Component '#component' must render a single root element. \n\t#elements",
	"ref-collision": "Ref collision detected for ref '#ref' in component '#component'.",
	"unknown": "An unknown error occurred.",
	"unknown-from": "An unknown error occurred in component '#from'."
}

export default errorMessages;