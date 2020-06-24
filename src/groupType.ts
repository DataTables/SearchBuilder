import Criteria from './criteria';
import Group from './group';

export interface IClassses {
	add: string;
	button: string;
	clearGroup: string;
	greyscale: string;
	group: string;
	indentSub: string;
	indentTop: string;
	inputButton: string;
	logic: string;
	logicContainer: string;
}

export interface IDom {
	add: JQuery<HTMLElement>;
	clear: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	logic: JQuery<HTMLElement>;
	logicContainer: JQuery<HTMLElement>;
}

export interface IDefaults {
	depthLimit: boolean | number;
	greyscale: boolean;
	logic: string;
}

export interface IS {
	criteria: any[];
	depth: number;
	dt: any;
	index: number;
	isChild: boolean;
	logic: string;
	opts: any;
	toDrop: Criteria;
	topGroup: JQuery<HTMLElement>;
}

export interface ICriteria {
	criteria: any;
	index: number;
}

export interface IDetails {
	criteria: any[];
	logic: string;
}
