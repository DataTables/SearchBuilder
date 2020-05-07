export interface IClasses {
	condition: string;
	container: string;
	delete: string;
	dropDown: string;
	field: string;
	greyscale: string;
	input: string;
	joiner: string;
	left: string;
	option: string;
	right: string;
	roundButton: string;
	value: string;
	vertical: string;
}

export interface ICondition {
	display: string;
	comparator: any;
	type: string;
	valueInputs: number;
	joiner?: string;
}

export interface IDefaults {
	allowed: number[] | boolean;
	conditions: {[keys: string]: ICondition[]};
	depthLimit: number | boolean;
	greyscale: boolean;
	orthogonal: IOrthogonal;
}

export interface IOrthogonal {
	display: string;
	search: string;
}

export interface IDom {
	condition: JQuery<HTMLElement>;
	conditionTitle: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	delete: JQuery<HTMLElement>;
	field: JQuery<HTMLElement>;
	fieldTitle: JQuery<HTMLElement>;
	left: JQuery<HTMLElement>;
	right: JQuery<HTMLElement>;
	value: JQuery<HTMLElement>;
	valueInputs: Array<JQuery<HTMLElement>>;
	valueTitle: JQuery<HTMLElement>;
}

export interface IS {
	condition: string;
	conditions: ICondition[];
	depth: number;
	dt: any;
	field: number;
	fields: IFieldOpt[];
	filled: boolean;
	index: number;
	type: string;
	value: any[];
	values: any[];
}

export interface IFieldOpt {
	text: string;
	index: number;
}

export interface IDetails {
	condition: string;
	field: number;
	type: string;
	value: any[];
}
