type TypesMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
}

interface Prop {
	type: keyof TypesMap;
	isValid: (value: TypesMap[keyof TypesMap]) => boolean;
}

export default Prop;