type TypesMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
}

interface Prop {
	type: keyof TypesMap;
	parse: (value: string) => TypesMap[keyof TypesMap];
}

export default Prop;