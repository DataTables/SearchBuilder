import Group from './group';

export interface II18n {
	add: string;
	button: string | object;
	clearAll: string;
	condition: string;
	data: string;
	deleteTitle: string;
	logicAnd: string;
	logicOr: string;
	leftTitle: string;
	rightTitle: string;
	title: string | object;
	value: string;
}

export interface IDetails {
	criteria: any[];
	logic: string;
}

export interface IClasses {
	button: string;
	clearAll: string;
	container: string;
	inputButton: string;
	title: string;
	titleRow: string;
}

export interface IDefaults {
	filterChanged: any;
	preDefined: boolean | IDetails;
	i18n: II18n;
}

export interface IDom {
	clearAll: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	title: JQuery<HTMLElement>;
	titleRow: JQuery<HTMLElement>;
	topGroup: JQuery<HTMLElement>;
}

export interface IS {
	dt: any;
	opts: any;
	search: any;
	topGroup: Group;
}
