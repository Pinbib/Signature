type HTMLTemplate = {
	strings: TemplateStringsArray,
	values: any[]
};

export default function html(strings: TemplateStringsArray, ...values: any[]): HTMLTemplate {
	return {strings, values};
}

type unsafeHTMLTemplate = { type: "unsafeHTML", value: any };

export function unsafeHTML(value: any): unsafeHTMLTemplate {
	return {type: "unsafeHTML", value: value};
}

export function joinTemplates(...templates: HTMLTemplate[]): HTMLTemplate {
	let strings: string[] = [];
	let values: any[] = [];

	templates.forEach((t) => {
		strings.push(...t.strings);
		values.push(...t.values);
	});

	return {
		strings: strings as unknown as TemplateStringsArray,
		values: values
	} as HTMLTemplate;
}

// todo: make a loop function