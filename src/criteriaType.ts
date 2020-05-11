export interface IClasses {
	button: string;
	condition: string;
	container: string;
	delete: string;
	dropDown: string;
	data: string;
	greyscale: string;
	input: string;
	joiner: string;
	left: string;
	option: string;
	right: string;
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
	data: JQuery<HTMLElement>;
	dataTitle: JQuery<HTMLElement>;
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
	data: number;
	dataPoints: IDataOpt[];
	filled: boolean;
	index: number;
	topGroup: JQuery<HTMLElement>;
	type: string;
	value: any[];
	values: any[];
}

export interface IDataOpt {
	text: string;
	index: number;
}

export interface IDetails {
	condition: string;
	data: number;
	type: string;
	value: any[];
}
