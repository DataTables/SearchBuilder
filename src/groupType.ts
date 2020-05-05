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
	roundButton: string;
}

export interface IDom {
	add: JQuery<HTMLElement>;
	clear: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	logic: JQuery<HTMLElement>;
}

export interface IDefaults {
	depthLimit: boolean | number;
	greyscale: boolean;
	logic: string;
}

export interface IS {
	criteria: ICriteria[];
	depth: number;
	dt: any;
	index: number;
	isChild: boolean;
	logic: string;
	opts: any;
	toDrop: Criteria;
}

export interface ICriteria {
	criteria: any;
	index: number;
	type: string;
}

export interface IDetails {
	criteria: any[];
	logic: string;
	type: string;
}
