export interface IClasses {
	button: string;
	condition: string;
	container: string;
	delete: string;
	dropDown: string;
	data: string;
	greyscale: string;
	input: string;
	italic: string;
	joiner: string;
	left: string;
	notItalic: string;
	option: string;
	right: string;
	value: string;
	vertical: string;
}

export interface ICondition {
	isInputValid: any;
	conditionName: string;
	search: any;
	init: any;
	inputValue: any;
}

export interface IDefaults {
	columns: number[] | boolean;
	conditions: {[keys: string]: {[keys: string]: ICondition}};
	depthLimit: number | boolean;
	greyscale: boolean;
	orthogonal: IOrthogonal;
}

export interface IOrthogonal {
	conditionName: string;
	search: string;
}

export interface IDom {
	condition: JQuery<HTMLElement>;
	conditionTitle: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	delete: JQuery<HTMLElement>;
	data: JQuery<HTMLElement>;
	dataTitle: JQuery<HTMLElement>;
	defaultValue: JQuery<HTMLElement>;
	left: JQuery<HTMLElement>;
	right: JQuery<HTMLElement>;
	value: Array<JQuery<HTMLElement>>;
	valueTitle: JQuery<HTMLElement>;
}

export interface IS {
	condition: ICondition;
	conditions: ICondition[];
	depth: number;
	dt: any;
	dataIdx: number;
	dataPoints: IDataOpt[];
	data: string;
	filled: boolean;
	index: number;
	momentFormat: string | boolean;
	topGroup: JQuery<HTMLElement>;
	type: string;
	value: any[];
}

export interface IDataOpt {
	text: string;
	index: number;
}

export interface IDetails {
	condition: ICondition;
	dataIdx: number;
	data: string;
	value: any[];
}
