export default function html(strings: TemplateStringsArray, ...values: any[]): {
	strings: TemplateStringsArray,
	values: any[]
} {
	return {strings, values};
}

export function unsafeHTML(value: any): { type: "unsafeHTML", value: any } {
	return {type: "unsafeHTML", value: value};
}