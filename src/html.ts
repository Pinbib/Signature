export default function html(strings: TemplateStringsArray, ...values: any[]): {
	strings: TemplateStringsArray,
	values: any[]
} {
	return {strings, values};
}