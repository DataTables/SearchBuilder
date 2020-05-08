import Group from './group';

export interface IDetails {
	criteria: any[];
	logic: string;
	type: string;
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
	preDefined: boolean | IDetails;
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
