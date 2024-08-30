import * as builderType from './searchBuilder';

export interface IClasses {
	button: string;
	buttonContainer: string;
	condition: string;
	container: string;
	data: string;
	delete: string;
	dropDown: string;
	greyscale: string;
	input: string;
	inputCont: string;
	italic: string;
	joiner: string;
	left: string;
	notItalic: string;
	option: string;
	right: string;
	select: string;
	value: string;
	vertical: string;
}

export interface ICondition {
	conditionName: string | ((dt: any, i18n: any) => string);
	init: (
		that?: Criteria,
		fn?: (thatAgain: Criteria, el: JQuery<HTMLElement>) => void,
		preDefined?: string[]
	) => JQuery<HTMLElement> | Array<JQuery<HTMLElement>> | void;
	inputValue: (el: JQuery<HTMLElement>) => string[] | void;
	isInputValid: (val: Array<JQuery<HTMLElement>>, that: Criteria) => boolean;
	search: (value: string, comparison: string[], that: Criteria) => boolean;
}

export interface IOrthogonal {
	display: string;
	search: string;
}

export interface IDom {
	buttons: JQuery<HTMLElement>;
	condition: JQuery<HTMLElement>;
	conditionTitle: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	data: JQuery<HTMLElement>;
	dataTitle: JQuery<HTMLElement>;
	defaultValue: JQuery<HTMLElement>;
	delete: JQuery<HTMLElement>;
	inputCont: JQuery<HTMLElement>;
	left: JQuery<HTMLElement>;
	right: JQuery<HTMLElement>;
	value: Array<JQuery<HTMLElement>>;
	valueTitle: JQuery<HTMLElement>;
}

export interface IS {
	condition: string;
	conditions: {[keys: string]: ICondition};
	data: string;
	dataIdx: number;
	dataPoints: IDataOpt[];
	dateFormat: string | boolean;
	depth: number;
	dt: any;
	filled: boolean;
	index: number;
	liveSearch: boolean;
	origData: string;
	preventRedraw: boolean;
	serverData: {[keys: string]: builderType.IServerData[]};
	topGroup: JQuery<HTMLElement>;
	type: string;
	value: string[];
}

export interface IDataOpt {
	index: number;
	origData: string;
	text: string;
}

export interface IDetails {
	condition?: string;
	criteria?: Criteria;
	data?: string;
	index?: number;
	logic?: string;
	origData?: string;
	type?: string;
	value?: string[];
}

let $: any;
let dataTable: any;

/** Get a moment object. Attempt to get from DataTables for module loading first. */
function moment() {
	var used = DataTable.use('moment');

	return used
		? used
		: (window as any).moment;
}

/** Get a luxon object. Attempt to get from DataTables for module loading first. */
function luxon() {
	var used = DataTable.use('luxon');

	return used
		? used
		: (window as any).luxon;
}

/**
 * Sets the value of jQuery for use in the file
 *
 * @param jq the instance of jQuery to be set
 */
export function setJQuery(jq: any): void {
	$ = jq;
	dataTable = jq.fn.dataTable;
}

/**
 * The Criteria class is used within SearchBuilder to represent a search criteria
 */
export default class Criteria {
	private static version = '1.1.0';

	private static classes: IClasses = {
		button: 'dtsb-button',
		buttonContainer: 'dtsb-buttonContainer',
		condition: 'dtsb-condition',
		container: 'dtsb-criteria',
		data: 'dtsb-data',
		delete: 'dtsb-delete',
		dropDown: 'dtsb-dropDown',
		greyscale: 'dtsb-greyscale',
		input: 'dtsb-input',
		inputCont: 'dtsb-inputCont',
		italic: 'dtsb-italic',
		joiner: 'dtsb-joiner',
		left: 'dtsb-left',
		notItalic: 'dtsb-notItalic',
		option: 'dtsb-option',
		right: 'dtsb-right',
		select: 'dtsb-select',
		value: 'dtsb-value',
		vertical: 'dtsb-vertical'
	};

	public classes: IClasses;
	public dom: IDom;
	public c: builderType.IDefaults;
	public s: IS;

	public constructor(
		table: any,
		opts: builderType.IDefaults,
		topGroup: JQuery<HTMLElement>,
		index = 0,
		depth = 1,
		serverData = undefined,
		liveSearch = false
	) {
		this.classes = $.extend(true, {}, Criteria.classes);

		// Get options from user and any extra conditions/column types defined by plug-ins
		this.c = $.extend(true, {}, Criteria.defaults, $.fn.dataTable.ext.searchBuilder, opts);
		let i18n = this.c.i18n;

		this.s = {
			condition: undefined,
			conditions: {},
			data: undefined,
			dataIdx: -1,
			dataPoints: [],
			dateFormat: false,
			depth,
			dt: table,
			filled: false,
			index,
			liveSearch: liveSearch,
			origData: undefined,
			preventRedraw: false,
			serverData,
			topGroup,
			type: '',
			value: [],
		};

		this.dom = {
			buttons: $('<div/>')
				.addClass(this.classes.buttonContainer),
			condition: $('<select disabled/>')
				.addClass(this.classes.condition)
				.addClass(this.classes.dropDown)
				.addClass(this.classes.italic)
				.attr('autocomplete', 'hacking'),
			conditionTitle: $('<option value="" disabled selected hidden/>')
				.html(this.s.dt.i18n('searchBuilder.condition', i18n.condition)),
			container: $('<div/>')
				.addClass(this.classes.container),
			data: $('<select/>')
				.addClass(this.classes.data)
				.addClass(this.classes.dropDown)
				.addClass(this.classes.italic),
			dataTitle: $('<option value="" disabled selected hidden/>')
				.html(this.s.dt.i18n('searchBuilder.data', i18n.data)),
			defaultValue: $('<select disabled/>')
				.addClass(this.classes.value)
				.addClass(this.classes.dropDown)
				.addClass(this.classes.select)
				.addClass(this.classes.italic),
			delete: $('<button/>')
				.html(this.s.dt.i18n('searchBuilder.delete', i18n.delete))
				.addClass(this.classes.delete)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.deleteTitle', i18n.deleteTitle))
				.attr('type', 'button'),
			inputCont: $('<div/>')
				.addClass(this.classes.inputCont),
			// eslint-disable-next-line no-useless-escape
			left: $('<button/>')
				.html(this.s.dt.i18n('searchBuilder.left', i18n.left))
				.addClass(this.classes.left)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.leftTitle', i18n.leftTitle))
				.attr('type', 'button'),
			// eslint-disable-next-line no-useless-escape
			right: $('<button/>')
				.html(this.s.dt.i18n('searchBuilder.right', i18n.right))
				.addClass(this.classes.right)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.rightTitle', i18n.rightTitle))
				.attr('type', 'button'),
			value: [
				$('<select disabled/>')
					.addClass(this.classes.value)
					.addClass(this.classes.dropDown)
					.addClass(this.classes.italic)
					.addClass(this.classes.select)
			],
			valueTitle: $('<option value="--valueTitle--" disabled selected hidden/>')
				.html(this.s.dt.i18n('searchBuilder.value', i18n.value)),
		};

		// If the greyscale option is selected then add the class to add the grey colour to SearchBuilder
		if (this.c.greyscale) {
			this.dom.data.addClass(this.classes.greyscale);
			this.dom.condition.addClass(this.classes.greyscale);
			this.dom.defaultValue.addClass(this.classes.greyscale);

			for (let val of this.dom.value) {
				val.addClass(this.classes.greyscale);
			}
		}

		$(window).on('resize.dtsb', dataTable.util.throttle(() => {
			this.s.topGroup.trigger('dtsb-redrawLogic');
		}));

		this._buildCriteria();

		return this;
	}

	/**
	 * Escape html characters within a string
	 *
	 * @param txt the string to be escaped
	 * @returns the escaped string
	 */
	private static _escapeHTML(txt: string): string {
		return txt
			.toString()
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&amp;/g, '&');
	}

	/**
	 * Default initialisation function for select conditions
	 */
	private static initSelect = function(that, fn, preDefined = null, array = false): Array<JQuery<HTMLElement>> {
		let column = that.dom.data.children('option:selected').val();
		let indexArray = that.s.dt.rows().indexes().toArray();
		let fastData = that.s.dt.settings()[0].fastData;
		that.dom.valueTitle.prop('selected', true);

		// Declare select element to be used with all of the default classes and listeners.
		let el = $('<select/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.dropDown)
			.addClass(Criteria.classes.italic)
			.addClass(Criteria.classes.select)
			.append(that.dom.valueTitle)
			.on('change.dtsb', function() {
				$(this).removeClass(Criteria.classes.italic);
				fn(that, this);
			});

		if (that.c.greyscale) {
			el.addClass(Criteria.classes.greyscale);
		}

		let added = [];
		let options = [];

		// Add all of the options from the table to the select element.
		// Only add one option for each possible value
		for (let index of indexArray) {
			let filter = fastData(
				index,
				column,
				typeof that.c.orthogonal === 'string' ?
					that.c.orthogonal :
					that.c.orthogonal.search
			);
			let value = {
				filter: typeof filter === 'string' ?
					filter.replace(/[\r\n\u2028]/g, ' ') : // Need to replace certain characters to match search values
					filter,
				index,
				text: fastData(
					index,
					column,
					typeof that.c.orthogonal === 'string' ?
						that.c.orthogonal :
						that.c.orthogonal.display
				)
			};

			// If we are dealing with an array type, either make sure we are working with arrays, or sort them
			if (that.s.type === 'array') {
				value.filter = !Array.isArray(value.filter) ? [value.filter] : value.filter;
				value.text = !Array.isArray(value.text) ? [value.text] : value.text;
			}

			// Function to add an option to the select element
			let addOption = (filt, text) => {
				if (that.s.type.includes('html') && filt !== null && typeof filt === 'string') {
					filt.replace(/(<([^>]+)>)/ig, '');
				}

				// Add text and value, stripping out any html if that is the column type
				let opt = $('<option>', {
					type: Array.isArray(filt) ? 'Array' : 'String',
					value: filt
				})
					.data('sbv', filt)
					.addClass(that.classes.option)
					.addClass(that.classes.notItalic)
					// Have to add the text this way so that special html characters are not escaped - &amp; etc.
					.html(
						typeof text === 'string' ?
							text.replace(/(<([^>]+)>)/ig, '') :
							text
					);

				let val = opt.val();

				// Check that this value has not already been added
				if (added.indexOf(val) === -1) {
					added.push(val);
					options.push(opt);

					if (preDefined !== null && Array.isArray(preDefined[0])) {
						preDefined[0] = preDefined[0].sort().join(',');
					}

					// If this value was previously selected as indicated by preDefined, then select it again
					if (preDefined !== null && opt.val() === preDefined[0]) {
						opt.prop('selected', true);
						el.removeClass(Criteria.classes.italic);
						that.dom.valueTitle.removeProp('selected');
					}
				}
			};

			// If this is to add the individual values within the array we need to loop over the array
			if (array) {
				for (let i = 0; i < value.filter.length; i++) {
					addOption(value.filter[i], value.text[i]);
				}
			}
			// Otherwise the value that is in the cell is to be added
			else {
				addOption(value.filter, Array.isArray(value.text) ? value.text.join(', ') : value.text);
			}
		}

		options.sort((a, b) => {
			if (
				that.s.type === 'array' ||
				that.s.type === 'string' ||
				that.s.type === 'html'
			) {
				if (a.val() < b.val()) {
					return -1;
				}
				else if (a.val() > b.val()) {
					return 1;
				}
				else {
					return 0;
				}
			}
			else if (
				that.s.type === 'num' ||
				that.s.type === 'html-num'
			) {
				if (+a.val().replace(/(<([^>]+)>)/ig, '') < +b.val().replace(/(<([^>]+)>)/ig, '')) {
					return -1;
				}
				else if (+a.val().replace(/(<([^>]+)>)/ig, '') > +b.val().replace(/(<([^>]+)>)/ig, '')) {
					return 1;
				}
				else {
					return 0;
				}
			}
			else if (that.s.type === 'num-fmt' || that.s.type === 'html-num-fmt') {
				if (+a.val().replace(/[^0-9.]/g, '') < +b.val().replace(/[^0-9.]/g, '')) {
					return -1;
				}
				else if (+a.val().replace(/[^0-9.]/g, '') > +b.val().replace(/[^0-9.]/g, '')) {
					return 1;
				}
				else {
					return 0;
				}
			}
		});

		for (let opt of options) {
			el.append(opt);
		}

		return el;
	};

	/**
	 * Default initialisation function for select conditions
	 */
	private static initSelectSSP = function(that, fn, preDefined = null): Array<JQuery<HTMLElement>> {
		that.dom.valueTitle.prop('selected', true);

		// Declare select element to be used with all of the default classes and listeners.
		let el = $('<select/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.dropDown)
			.addClass(Criteria.classes.italic)
			.addClass(Criteria.classes.select)
			.append(that.dom.valueTitle)
			.on('change.dtsb', function() {
				$(this).removeClass(Criteria.classes.italic);
				fn(that, this);
			});

		if (that.c.greyscale) {
			el.addClass(Criteria.classes.greyscale);
		}

		let options = [];

		for(let option of that.s.serverData[that.s.origData]) {
			let value = option.value;
			let label = option.label;
			// Function to add an option to the select element
			let addOption = (filt, text) => {
				if (that.s.type.includes('html') && filt !== null && typeof filt === 'string') {
					filt.replace(/(<([^>]+)>)/ig, '');
				}

				// Add text and value, stripping out any html if that is the column type
				let opt = $('<option>', {
					type: Array.isArray(filt) ? 'Array' : 'String',
					value: filt
				})
					.data('sbv', filt)
					.addClass(that.classes.option)
					.addClass(that.classes.notItalic)
					// Have to add the text this way so that special html characters are not escaped - &amp; etc.
					.html(
						typeof text === 'string' ?
							text.replace(/(<([^>]+)>)/ig, '') :
							text
					);

				options.push(opt);

				// If this value was previously selected as indicated by preDefined, then select it again
				if (preDefined !== null && opt.val() === preDefined[0]) {
					opt.prop('selected', true);
					el.removeClass(Criteria.classes.italic);
					that.dom.valueTitle.removeProp('selected');
				}
			};

			addOption(value, label);
		}

		for (let opt of options) {
			el.append(opt);
		}

		return el;
	};

	/**
	 * Default initialisation function for select array conditions
	 *
	 * This exists because there needs to be different select functionality for contains/without and equals/not
	 */
	private static initSelectArray = function(that, fn, preDefined = null): Array<JQuery<HTMLElement>> {
		return Criteria.initSelect(that, fn, preDefined, true);
	};

	/**
	 * Default initialisation function for input conditions
	 */
	private static initInput = function(
		that: Criteria,
		fn: (thatAgain: Criteria, elInput: JQuery<HTMLElement>, code: number) => void,
		preDefined = null
	): Array<JQuery<HTMLElement>> {
		// Declare the input element
		let searchDelay = that.s.dt.settings()[0].searchDelay;
		let el = $('<input/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.input)
			.on('input.dtsb keypress.dtsb', that._throttle(
				function(e) {
					let code = e.keyCode || e.which;
					return fn(that, this, code);
				},
				searchDelay === null ? 100 : searchDelay
			));

		if (that.c.greyscale) {
			el.addClass(Criteria.classes.greyscale);
		}

		// If there is a preDefined value then add it
		if (preDefined !== null) {
			el.val(preDefined[0]);
		}

		// This is add responsive functionality to the logic button without redrawing everything else
		that.s.dt.one('draw.dtsb', () => {
			that.s.topGroup.trigger('dtsb-redrawLogic');
		});

		return el;
	};

	/**
	 * Default initialisation function for conditions requiring 2 inputs
	 */
	private static init2Input = function(
		that: Criteria,
		fn: (thatAgain: Criteria, el: JQuery<HTMLElement>, code: number) => void,
		preDefined = null
	): Array<JQuery<HTMLElement>> {
		// Declare all of the necessary jQuery elements
		let searchDelay = that.s.dt.settings()[0].searchDelay;
		let els = [
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.on('input.dtsb keypress.dtsb', that._throttle(
					function(e) {
						let code = e.keyCode || e.which;
						return fn(that, this, code);
					},
					searchDelay === null ? 100 : searchDelay
				)),
			$('<span>')
				.addClass(that.classes.joiner)
				.html(
					that.s.dt.i18n('searchBuilder.valueJoiner', that.c.i18n.valueJoiner)
				),
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.on('input.dtsb keypress.dtsb', that._throttle(
					function(e) {
						let code = e.keyCode || e.which;
						return fn(that, this, code);
					},
					searchDelay === null ? 100 : searchDelay
				))
		];

		if (that.c.greyscale) {
			els[0].addClass(Criteria.classes.greyscale);
			els[2].addClass(Criteria.classes.greyscale);
		}

		// If there is a preDefined value then add it
		if (preDefined !== null) {
			els[0].val(preDefined[0]);
			els[2].val(preDefined[1]);
		}

		// This is add responsive functionality to the logic button without redrawing everything else
		that.s.dt.one('draw.dtsb', () => {
			that.s.topGroup.trigger('dtsb-redrawLogic');
		});

		return els;
	};

	/**
	 * Default initialisation function for date conditions
	 */
	private static initDate = function(
		that: Criteria,
		fn: (thatAgain: Criteria, elInput: JQuery<HTMLElement>, code?: number) => void,
		preDefined = null
	): Array<JQuery<HTMLElement>> {
		let searchDelay = that.s.dt.settings()[0].searchDelay;
		let i18n = that.s.dt.i18n('datetime', {});

		// Declare date element using DataTables dateTime plugin
		let el = $('<input/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.input)
			.dtDateTime({
				attachTo: 'input',
				format: that.s.dateFormat ? that.s.dateFormat : undefined,
				i18n,
			})
			.on('change.dtsb',
				that._throttle(
					function() {
						return fn(that, this);
					},
					searchDelay === null ? 100 : searchDelay
				)
			)
			.on(
				'input.dtsb keypress.dtsb',
				(e) => {
					that._throttle(
						function() {
							let code = e.keyCode || e.which;

							return fn(that, this, code);
						},
						searchDelay === null ? 100 : searchDelay
					);
				}
			);

		if (that.c.greyscale) {
			el.addClass(Criteria.classes.greyscale);
		}

		// If there is a preDefined value then add it
		if (preDefined !== null) {
			el.val(preDefined[0]);
		}

		// This is add responsive functionality to the logic button without redrawing everything else
		that.s.dt.one('draw.dtsb', () => {
			that.s.topGroup.trigger('dtsb-redrawLogic');
		});

		return el;
	};

	private static initNoValue = function(that: Criteria): Array<JQuery<HTMLElement>> {
		// This is add responsive functionality to the logic button without redrawing everything else
		that.s.dt.one('draw.dtsb', () => {
			that.s.topGroup.trigger('dtsb-redrawLogic');
		});

		return [];
	};

	private static init2Date = function(
		that: Criteria,
		fn: (thatAgain: Criteria, el: JQuery<HTMLElement>, code?: number) => void,
		preDefined: string[] = null
	): Array<JQuery<HTMLElement>> {
		let searchDelay = that.s.dt.settings()[0].searchDelay;
		let i18n = that.s.dt.i18n('datetime', {});

		// Declare all of the date elements that are required using DataTables dateTime plugin
		let els = [
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.dtDateTime({
					attachTo: 'input',
					format: that.s.dateFormat ? that.s.dateFormat : undefined,
					i18n,
				})
				.on('change.dtsb', searchDelay !== null ?
					DataTable.util.throttle(
						function() {
							return fn(that, this);
						},
						searchDelay
					) :
					() => {
						fn(that, this);
					}
				)
				.on(
					'input.dtsb keypress.dtsb',
					(e) => {
						DataTable.util.throttle(
							function() {
								let code = e.keyCode || e.which;
								return fn(that, this, code);
							},
							searchDelay === null ? 0 : searchDelay
						);
					}
				),
			$('<span>')
				.addClass(that.classes.joiner)
				.html(that.s.dt.i18n('searchBuilder.valueJoiner', that.c.i18n.valueJoiner)),
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.dtDateTime({
					attachTo: 'input',
					format: that.s.dateFormat ? that.s.dateFormat : undefined,
					i18n,
				})
				.on('change.dtsb', searchDelay !== null ?
					DataTable.util.throttle(
						function() {
							return fn(that, this);
						},
						searchDelay
					) :
					() => {
						fn(that, this);
					}
				)
				.on(
					'input.dtsb keypress.dtsb',
					!that.c.enterSearch &&
					!(
						that.s.dt.settings()[0].oInit.search !== undefined &&
						that.s.dt.settings()[0].oInit.search.return
					) &&
					searchDelay !== null ?
						DataTable.util.throttle(
							function() {
								return fn(that, this);
							},
							searchDelay
						) :
						(e) => {
							let code = e.keyCode || e.which;
							fn(that, this, code);
						}
				)
		];

		if (that.c.greyscale) {
			els[0].addClass(Criteria.classes.greyscale);
			els[2].addClass(Criteria.classes.greyscale);
		}

		// If there are and preDefined values then add them
		if (preDefined !== null && preDefined.length > 0) {
			els[0].val(preDefined[0]);
			els[2].val(preDefined[1]);
		}

		// This is add responsive functionality to the logic button without redrawing everything else
		that.s.dt.one('draw.dtsb', () => {
			that.s.topGroup.trigger('dtsb-redrawLogic');
		});

		return els;
	};

	/**
	 * Default function for select elements to validate condition
	 */
	private static isInputValidSelect = function(el) {
		let allFilled = true;

		// Check each element to make sure that the selections are valid
		for (let element of el) {
			if (
				element.children('option:selected').length ===
					element.children('option').length -
					element.children('option.' + Criteria.classes.notItalic).length &&
				element.children('option:selected').length === 1 &&
				element.children('option:selected')[0] === element.children('option')[0]
			) {
				allFilled = false;
			}
		}

		return allFilled;
	};

	/**
	 * Default function for input and date elements to validate condition
	 */
	private static isInputValidInput = function(el) {
		let allFilled = true;

		// Check each element to make sure that the inputs are valid
		for (let element of el) {
			if (element.is('input') && element.val().length === 0) {
				allFilled = false;
			}
		}

		return allFilled;
	};

	/**
	 * Default function for getting select conditions
	 */
	private static inputValueSelect = function(el) {
		let values = [];

		// Go through the select elements and push each selected option to the return array
		for (let element of el) {
			if (element.is('select')) {
				values.push(Criteria._escapeHTML(element.children('option:selected').data('sbv')));
			}
		}

		return values;
	};

	/**
	 * Default function for getting input conditions
	 */
	private static inputValueInput = function(el) {
		let values = [];

		// Go through the input elements and push each value to the return array
		for (let element of el) {
			if (element.is('input')) {
				values.push(Criteria._escapeHTML(element.val()));
			}
		}

		return values.map(dataTable.util.diacritics) as string[];
	};

	/**
	 * Function that is run on each element as a call back when a search should be triggered
	 */
	private static updateListener = function(that, el, code?) {
		// When the value is changed the criteria is now complete so can be included in searches
		// Get the condition from the map based on the key that has been selected for the condition
		let condition = that.s.conditions[that.s.condition];
		let i;

		that.s.filled = condition.isInputValid(that.dom.value, that);
		that.s.value = condition.inputValue(that.dom.value, that);

		if (!that.s.filled) {
			if (
				!that.c.enterSearch &&
				!(
					that.s.dt.settings()[0].oInit.search !== undefined &&
					that.s.dt.settings()[0].oInit.search.return
				) ||
				code === 13
			) {
				that.doSearch();
			}
			return;
		}

		if (!Array.isArray(that.s.value)) {
			that.s.value = [that.s.value];
		}

		for (i = 0; i < that.s.value.length; i++) {
			// If the value is an array we need to sort it
			if (Array.isArray(that.s.value[i])) {
				that.s.value[i].sort();
			}
		}

		// Take note of the cursor position so that we can refocus there later
		let idx: number = null;
		let cursorPos: number = null;

		for (i = 0; i < that.dom.value.length; i++) {
			if (el === that.dom.value[i][0]) {
				idx = i;

				if (el.selectionStart !== undefined) {
					cursorPos = el.selectionStart;
				}
			}
		}

		if (
			!that.c.enterSearch &&
			!(
				that.s.dt.settings()[0].oInit.search !== undefined &&
				that.s.dt.settings()[0].oInit.search.return
			) ||
			code === 13
		) {
			// Trigger a search
			that.doSearch();
		}

		// Refocus the element and set the correct cursor position
		if (idx !== null) {
			that.dom.value[idx].removeClass(that.classes.italic);
			that.dom.value[idx].focus();

			if (cursorPos !== null) {
				that.dom.value[idx][0].setSelectionRange(cursorPos, cursorPos);
			}
		}
	};

	/**
	 * Redraw the DataTable with the current search parameters
	 */
	private doSearch() {
		// Only do the search if live search is disabled, otherwise the search
		// is triggered by the button at the top level group.
		if (this.c.liveSearch) {
			this.s.dt.draw();
		}
	};
	
	/**
	 * Parses formatted numbers down to a form where they can be compared.
	 * Note that this does not account for different decimal characters. Use
	 * parseNumber instead on the instance.
	 *
	 * @param val the value to convert
	 * @returns the converted value
	 */
	private static parseNumFmt(val) {
		return +val.replace(/(?!^-)[^0-9.]/g, '');
	}

	// The order of the conditions will make eslint sad :(
	// Has to be in this order so that they are displayed correctly in select elements
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static dateConditions: {[keys: string]: ICondition} = {
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.equals', i18n.conditions.date.equals);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				value = value.replace(/(\/|-|,)/g, '-');

				return value === comparison[0];
			},
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.not', i18n.conditions.date.not);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				value = value.replace(/(\/|-|,)/g, '-');

				return value !== comparison[0];
			},
		},
		'<': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.before', i18n.conditions.date.before);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				value = value.replace(/(\/|-|,)/g, '-');

				return value < comparison[0];
			},
		},
		'>': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.after', i18n.conditions.date.after);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				value = value.replace(/(\/|-|,)/g, '-');

				return value > comparison[0];
			},
		},
		'between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.between', i18n.conditions.date.between);
			},
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				value = value.replace(/(\/|-|,)/g, '-');
				if (comparison[0] < comparison[1]) {
					return comparison[0] <= value && value <= comparison[1];
				}
				else {
					return comparison[1] <= value && value <= comparison[0];
				}
			},
		},
		'!between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.notBetween', i18n.conditions.date.notBetween);
			},
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				value = value.replace(/(\/|-|,)/g, '-');
				if (comparison[0] < comparison[1]) {
					return !(comparison[0] <= value && value <= comparison[1]);
				}
				else {
					return !(comparison[1] <= value && value <= comparison[0]);
				}
			},
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.empty', i18n.conditions.date.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return value === null || value === undefined || value.length === 0;
			},
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.notEmpty', i18n.conditions.date.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		}
	};

	// The order of the conditions will make eslint sad :(
	// Has to be in this order so that they are displayed correctly in select elements
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static momentDateConditions: {[keys: string]: ICondition} = {
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.equals', i18n.conditions.date.equals);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return moment()(value, that.s.dateFormat).valueOf() ===
					moment()(comparison[0], that.s.dateFormat).valueOf();
			},
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.not', i18n.conditions.date.not);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return moment()(value, that.s.dateFormat).valueOf() !==
					moment()(comparison[0], that.s.dateFormat).valueOf();
			},
		},
		'<': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.before', i18n.conditions.date.before);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return moment()(value, that.s.dateFormat).valueOf() < moment()(comparison[0], that.s.dateFormat).valueOf();
			},
		},
		'>': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.after', i18n.conditions.date.after);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return moment()(value, that.s.dateFormat).valueOf() > moment()(comparison[0], that.s.dateFormat).valueOf();
			},
		},
		'between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.between', i18n.conditions.date.between);
			},
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				let val = moment()(value, that.s.dateFormat).valueOf();
				let comp0 = moment()(comparison[0], that.s.dateFormat).valueOf();
				let comp1 = moment()(comparison[1], that.s.dateFormat).valueOf();
				if (comp0 < comp1) {
					return comp0 <= val && val <= comp1;
				}
				else {
					return comp1 <= val && val <= comp0;
				}
			},
		},
		'!between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.notBetween', i18n.conditions.date.notBetween);
			},
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				let val = moment()(value, that.s.dateFormat).valueOf();
				let comp0 = moment()(comparison[0], that.s.dateFormat).valueOf();
				let comp1 = moment()(comparison[1], that.s.dateFormat).valueOf();
				if (comp0 < comp1) {
					return !(+comp0 <= +val && +val <= +comp1);
				}
				else {
					return !(+comp1 <= +val && +val <= +comp0);
				}
			},
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.empty', i18n.conditions.date.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return value === null || value === undefined || value.length === 0;
			},
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.notEmpty', i18n.conditions.date.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		}
	};

	// The order of the conditions will make eslint sad :(
	// Has to be in this order so that they are displayed correctly in select elements
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static luxonDateConditions: {[keys: string]: ICondition} = {
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.equals', i18n.conditions.date.equals);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return luxon().DateTime.fromFormat(value, that.s.dateFormat).ts
					=== luxon().DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
			},
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.not', i18n.conditions.date.not);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return luxon().DateTime.fromFormat(value, that.s.dateFormat).ts
					!== luxon().DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
			},
		},
		'<': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.before', i18n.conditions.date.before);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return luxon().DateTime.fromFormat(value, that.s.dateFormat).ts
					< luxon().DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
			},
		},
		'>': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.after', i18n.conditions.date.after);
			},
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				return luxon().DateTime.fromFormat(value, that.s.dateFormat).ts
					> luxon().DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
			},
		},
		'between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.between', i18n.conditions.date.between);
			},
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				let val = luxon().DateTime.fromFormat(value, that.s.dateFormat).ts;
				let comp0 = luxon().DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
				let comp1 = luxon().DateTime.fromFormat(comparison[1], that.s.dateFormat).ts;
				if (comp0 < comp1) {
					return comp0 <= val && val <= comp1;
				}
				else {
					return comp1 <= val && val <= comp0;
				}
			},
		},
		'!between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.notBetween', i18n.conditions.date.notBetween);
			},
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], that): boolean {
				let val = luxon().DateTime.fromFormat(value, that.s.dateFormat).ts;
				let comp0 = luxon().DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
				let comp1 = luxon().DateTime.fromFormat(comparison[1], that.s.dateFormat).ts;
				if (comp0 < comp1) {
					return !(+comp0 <= +val && +val <= +comp1);
				}
				else {
					return !(+comp1 <= +val && +val <= +comp0);
				}
			},
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.empty', i18n.conditions.date.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return value === null || value === undefined || value.length === 0;
			},
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.date.notEmpty', i18n.conditions.date.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		}
	};

	// The order of the conditions will make eslint sad :(
	// Has to be in this order so that they are displayed correctly in select elements
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static numConditions: {[keys: string]: ICondition} = {
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.equals', i18n.conditions.number.equals);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]): boolean {
				return +value === +comparison[0];
			},
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.not', i18n.conditions.number.not);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]): boolean {
				return +value !== +comparison[0];
			},
		},
		'<': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.lt', i18n.conditions.number.lt);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return +value < +comparison[0];
			},
		},
		'<=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.lte', i18n.conditions.number.lte);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return +value <= +comparison[0];
			},
		},
		'>=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.gte', i18n.conditions.number.gte);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return +value >= +comparison[0];
			},
		},
		'>': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.gt', i18n.conditions.number.gt);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return +value > +comparison[0];
			},
		},
		'between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.between', i18n.conditions.number.between);
			},
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				if (+comparison[0] < +comparison[1]) {
					return +comparison[0] <= +value && +value <= +comparison[1];
				}
				else {
					return +comparison[1] <= +value && +value <= +comparison[0];
				}
			},
		},
		'!between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.notBetween', i18n.conditions.number.notBetween);
			},
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				if (+comparison[0] < +comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.empty', i18n.conditions.number.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return value === null || value === undefined || value.length === 0;
			},
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.notEmpty', i18n.conditions.number.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		}
	};

	// The order of the conditions will make eslint sad :(
	// Has to be in this order so that they are displayed correctly in select elements
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static numFmtConditions: {[keys: string]: ICondition} = {
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.equals', i18n.conditions.number.equals);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				return criteria.parseNumber(value) === criteria.parseNumber(comparison[0]);
			},
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.not', i18n.conditions.number.not);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				return criteria.parseNumber(value) !== criteria.parseNumber(comparison[0]);
			},
		},
		'<': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.lt', i18n.conditions.number.lt);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				return criteria.parseNumber(value) < criteria.parseNumber(comparison[0]);
			},
		},
		'<=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.lte', i18n.conditions.number.lte);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				return criteria.parseNumber(value) <= criteria.parseNumber(comparison[0]);
			},
		},
		'>=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.gte', i18n.conditions.number.gte);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				return criteria.parseNumber(value) >= criteria.parseNumber(comparison[0]);
			},
		},
		'>': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.gt', i18n.conditions.number.gt);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				return criteria.parseNumber(value) > criteria.parseNumber(comparison[0]);
			},
		},
		'between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.between', i18n.conditions.number.between);
			},
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				let val = criteria.parseNumber(value);
				let comp0 = criteria.parseNumber(comparison[0]);
				let comp1 = criteria.parseNumber(comparison[1]);

				if (+comp0 < +comp1) {
					return +comp0 <= +val && +val <= +comp1;
				}
				else {
					return +comp1 <= +val && +val <= +comp0;
				}
			},
		},
		'!between': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.notBetween', i18n.conditions.number.notBetween);
			},
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[], criteria: Criteria): boolean {
				let val = criteria.parseNumber(value);
				let comp0 = criteria.parseNumber(comparison[0]);
				let comp1 = criteria.parseNumber(comparison[1]);

				if (+comp0 < +comp1) {
					return !(+comp0 <= +val && +val <= +comp1);
				}
				else {
					return !(+comp1 <= +val && +val <= +comp0);
				}
			},
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.empty', i18n.conditions.number.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return value === null || value === undefined || value.length === 0;
			},
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.number.notEmpty', i18n.conditions.number.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		}
	};

	// The order of the conditions will make eslint sad :(
	// Has to be in this order so that they are displayed correctly in select elements
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static stringConditions: {[keys: string]: ICondition} = {
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.equals', i18n.conditions.string.equals);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]): boolean {
				return value === comparison[0];
			},
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.not', i18n.conditions.string.not);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return value !== comparison[0];
			},
		},
		'starts': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.startsWith', i18n.conditions.string.startsWith);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === 0;
			},
		},
		'!starts': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.notStartsWith', i18n.conditions.string.notStartsWith);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) !== 0;
			},
		},
		'contains': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.contains', i18n.conditions.string.contains);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return value.toLowerCase().includes(comparison[0].toLowerCase());
			},
		},
		'!contains': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.notContains', i18n.conditions.string.notContains);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return !value.toLowerCase().includes(comparison[0].toLowerCase());
			},
		},
		'ends': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.endsWith', i18n.conditions.string.endsWith);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return value.toLowerCase().endsWith(comparison[0].toLowerCase());
			},
		},
		'!ends': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.notEndsWith', i18n.conditions.string.notEndsWith);
			},
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: string, comparison: string[]): boolean {
				return !value.toLowerCase().endsWith(comparison[0].toLowerCase());
			},
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.empty', i18n.conditions.string.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return value === null || value === undefined || value.length === 0;
			},
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.string.notEmpty', i18n.conditions.string.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		}
	};

	// The order of the conditions will make eslint sad :(
	// Also have to disable member ordering for this as the private methods used are not yet declared otherwise
	public static arrayConditions: {[keys: string]: ICondition} = {
		'contains': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.array.contains', i18n.conditions.array.contains);
			},
			init: Criteria.initSelectArray,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]) {
				return value.includes(comparison[0]);
			}
		},
		'without': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.array.without', i18n.conditions.array.without);
			},
			init: Criteria.initSelectArray,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]) {
				return value.indexOf(comparison[0]) === -1;
			}
		},
		'=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.array.equals', i18n.conditions.array.equals);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]) {
				if (value.length === comparison[0].length) {
					for (let i = 0; i < value.length; i++) {
						if (value[i] !== comparison[0][i]) {
							return false;
						}
					}

					return true;
				}

				return false;
			}
		},
		'!=': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.array.not', i18n.conditions.array.not);
			},
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: string, comparison: string[]) {
				if (value.length === comparison[0].length) {
					for (let i = 0; i < value.length; i++) {
						if (value[i] !== comparison[0][i]) {
							return true;
						}
					}

					return false;
				}

				return true;
			}
		},
		'null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.array.empty', i18n.conditions.array.empty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string) {
				return value === null || value === undefined || value.length === 0;
			}
		},
		'!null': {
			conditionName(dt, i18n): string {
				return dt.i18n('searchBuilder.conditions.array.notEmpty', i18n.conditions.array.notEmpty);
			},
			init: Criteria.initNoValue,
			inputValue() {
				return;
			},
			isInputValid() {
				return true;
			},
			search(value: string) {
				return value !== null && value !== undefined && value.length !== 0;
			}
		},
	};

	// eslint will be sad because we have to disable member ordering for this as the
	// private static properties used are not yet declared otherwise
	private static defaults: builderType.IDefaults = {
		columns: true,
		conditions: {
			'array': Criteria.arrayConditions,
			'date': Criteria.dateConditions,
			'html': Criteria.stringConditions,
			'html-num': Criteria.numConditions,
			'html-num-fmt': Criteria.numFmtConditions,
			'luxon': Criteria.luxonDateConditions,
			'moment': Criteria.momentDateConditions,
			'num': Criteria.numConditions,
			'num-fmt': Criteria.numFmtConditions,
			'string': Criteria.stringConditions
		},
		depthLimit: false,
		enterSearch: false,
		filterChanged: undefined,
		greyscale: false,
		i18n: {
			add: 'Add Condition',
			button: {
				0: 'Search Builder',
				_: 'Search Builder (%d)',
			},
			clearAll: 'Clear All',
			condition: 'Condition',
			data: 'Data',
			delete: '&times',
			deleteTitle: 'Delete filtering rule',
			left: '<',
			leftTitle: 'Outdent criteria',
			logicAnd: 'And',
			logicOr: 'Or',
			right: '>',
			rightTitle: 'Indent criteria',
			search: 'Search',
			title: {
				0: 'Custom Search Builder',
				_: 'Custom Search Builder (%d)',
			},
			value: 'Value',
			valueJoiner: 'and'
		},
		liveSearch: true,
		logic: 'AND',
		orthogonal: {
			display: 'display',
			search: 'filter'
		},
		preDefined: false
	};

	/**
	 * Adds the left button to the criteria
	 */
	public updateArrows(hasSiblings = false): void {
		// Empty the container and append all of the elements in the correct order
		this.dom.container.children().detach();
		this.dom.container
			.append(this.dom.data)
			.append(this.dom.condition)
			.append(this.dom.inputCont);

		this.setListeners();

		// Trigger the inserted events for the value elements as they are inserted
		if (this.dom.value[0] !== undefined) {
			$(this.dom.value[0]).trigger('dtsb-inserted');
		}

		for (let i = 1; i < this.dom.value.length; i++) {
			this.dom.inputCont.append(this.dom.value[i]);
			$(this.dom.value[i]).trigger('dtsb-inserted');
		}

		// If this is a top level criteria then don't let it move left
		if (this.s.depth > 1) {
			this.dom.buttons.append(this.dom.left);
		}

		// If the depthLimit of the query has been hit then don't add the right button
		if ((this.c.depthLimit === false || this.s.depth < this.c.depthLimit) && hasSiblings) {
			this.dom.buttons.append(this.dom.right);
		}
		else {
			this.dom.right.remove();
		}

		this.dom.buttons.append(this.dom.delete);
		this.dom.container.append(this.dom.buttons);
	}

	/**
	 * Destroys the criteria, removing listeners and container from the dom
	 */
	public destroy(): void {
		// Turn off listeners
		this.dom.data.off('.dtsb');
		this.dom.condition.off('.dtsb');
		this.dom.delete.off('.dtsb');

		for (let val of this.dom.value) {
			val.off('.dtsb');
		}

		// Remove container from the dom
		this.dom.container.remove();
	}

	/**
	 * Passes in the data for the row and compares it against this single criteria
	 *
	 * @param rowData The data for the row to be compared
	 * @returns boolean Whether the criteria has passed
	 */
	public search(rowData: any[], rowIdx: number): boolean {
		let settings = this.s.dt.settings()[0];
		let condition = this.s.conditions[this.s.condition];

		if (this.s.condition !== undefined && condition !== undefined) {
			let filter = rowData[this.s.dataIdx];
			// This check is in place for if a custom decimal character is in place
			if (
				this.s.type &&
				this.s.type.includes('num') &&
				(
					settings.oLanguage.sDecimal !== '' ||
					settings.oLanguage.sThousands !== ''
				)
			) {
				let splitRD = [rowData[this.s.dataIdx]];
				if (settings.oLanguage.sDecimal !== '') {
					splitRD = rowData[this.s.dataIdx].split(settings.oLanguage.sDecimal);
				}

				if (settings.oLanguage.sThousands !== '') {
					for (let i = 0; i < splitRD.length; i++) {
						splitRD[i] = splitRD[i].replace(settings.oLanguage.sThousands, ',');
					}
				}

				filter = splitRD.join('.');
			}

			// If orthogonal data is in place we need to get it's values for searching
			if (this.c.orthogonal.search !== 'filter') {
				filter = settings.fastData(
					rowIdx,
					this.s.dataIdx,
					typeof this.c.orthogonal === 'string' ?
						this.c.orthogonal :
						this.c.orthogonal.search
				);
			}

			if (this.s.type === 'array') {
				// Make sure we are working with an array
				if (!Array.isArray(filter)) {
					filter = [filter];
				}

				filter.sort();

				for (let filt of filter) {
					if(filt && typeof filt === 'string') {
						filt = filt.replace(/[\r\n\u2028]/g, ' ');
					}
				}

			}
			else if (filter !== null && typeof filter === 'string') {
				filter = filter.replace(/[\r\n\u2028]/g, ' ');
			}

			if (this.s.type.includes('html') && typeof filter === 'string') {
				filter = filter.replace(/(<([^>]+)>)/ig, '');
			}

			// Not ideal, but jqueries .val() returns an empty string even
			// when the value set is null, so we shall assume the two are equal
			if (filter === null) {
				filter = '';
			}

			return condition.search(filter, this.s.value, this);
		}
	}

	/**
	 * Gets the details required to rebuild the criteria
	 */
	public getDetails(deFormatDates=false): IDetails {
		let i;
		let settings = this.s.dt.settings()[0];

		// This check is in place for if a custom decimal character is in place
		if (
			this.s.type !== null &&
			["num", "num-fmt", "html-num", "html-num-fmt"].includes(this.s.type) &&
			(settings.oLanguage.sDecimal !== '' || settings.oLanguage.sThousands !== '')
		) {
			for (i = 0; i < this.s.value.length; i++) {
				let splitRD = [this.s.value[i].toString()];
				if (settings.oLanguage.sDecimal !== '') {
					splitRD = this.s.value[i].split(settings.oLanguage.sDecimal);
				}

				if (settings.oLanguage.sThousands !== '') {
					for (let j = 0; j < splitRD.length; j++) {
						splitRD[j] = splitRD[j].replace(settings.oLanguage.sThousands, ',');
					}
				}

				this.s.value[i] = splitRD.join('.');
			}
		}
		else if (this.s.type !== null && deFormatDates) {
			if (
				this.s.type.includes('date') ||
				this.s.type.includes('time')
			) {
				for (i = 0; i < this.s.value.length; i++) {
					if (this.s.value[i].match(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/g) === null) {
						this.s.value[i] = '';
					}
				}
			}
			else if(this.s.type.includes('moment')) {
				for (i = 0; i < this.s.value.length; i++) {
					if (
						this.s.value[i] &&
						this.s.value[i].length > 0 &&
						moment()(this.s.value[i], this.s.dateFormat, true).isValid()
					) {
						this.s.value[i] = moment()(this.s.value[i], this.s.dateFormat).format('YYYY-MM-DD HH:mm:ss');
					}
				}
			}
			else if(this.s.type.includes('luxon')) {
				for (i = 0; i < this.s.value.length; i++) {
					if (
						this.s.value[i] &&
						this.s.value[i].length > 0 &&
						luxon().DateTime.fromFormat(this.s.value[i], this.s.dateFormat).invalid === null
					) {
						this.s.value[i] = luxon().DateTime.fromFormat(this.s.value[i], this.s.dateFormat).toFormat('yyyy-MM-dd HH:mm:ss');
					}
				}
			}
		}

		if(this.s.type && this.s.type.includes('num') && this.s.dt.page.info().serverSide) {
			for (i = 0; i < this.s.value.length; i++) {
				this.s.value[i] = this.s.value[i].replace(/[^0-9.\-]/g, '');
			}
		}

		return {
			condition: this.s.condition,
			data: this.s.data,
			origData: this.s.origData,
			type: this.s.type,
			value: this.s.value.map(a => a !== null && a !== undefined ? a.toString() : a)
		};
	}

	/**
	 * Getter for the node for the container of the criteria
	 *
	 * @returns JQuery<HTMLElement> the node for the container
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
	}
	
	/**
	 * Parses formatted numbers down to a form where they can be compared
	 *
	 * @param val the value to convert
	 * @returns the converted value
	 */
	public parseNumber(val) {
		var decimal = this.s.dt.i18n('decimal');

		// Remove any periods and then replace the decimal with a period
		if (decimal && decimal !== '.') {
			val = val.replace(/\./g, '').replace(decimal, '.');
		}

		return +val.replace(/(?!^-)[^0-9.]/g, '');
	}

	/**
	 * Populates the criteria data, condition and value(s) as far as has been selected
	 */
	public populate(): void {
		this._populateData();

		// If the column index has been found attempt to select a condition
		if (this.s.dataIdx !== -1) {
			this._populateCondition();

			// If the condittion has been found attempt to select the values
			if (this.s.condition !== undefined) {
				this._populateValue();
			}
		}
	}

	/**
	 * Rebuilds the criteria based upon the details passed in
	 *
	 * @param loadedCriteria the details required to rebuild the criteria
	 */
	public rebuild(loadedCriteria: IDetails): void {
		// Check to see if the previously selected data exists, if so select it
		let foundData = false;
		let dataIdx, i;
		this._populateData();

		// If a data selection has previously been made attempt to find and select it
		if (loadedCriteria.data !== undefined) {
			let italic = this.classes.italic;
			let data = this.dom.data;

			this.dom.data.children('option').each(function() {
				if (
					!foundData &&
					(
						$(this).text() === loadedCriteria.data ||
						loadedCriteria.origData && $(this).prop('origData') === loadedCriteria.origData
					)
				) {
					$(this).prop('selected', true);
					data.removeClass(italic);
					foundData = true;
					dataIdx = parseInt($(this).val(), 10);
				}
				else {
					$(this).removeProp('selected');
				}
			});
		}

		// If the data has been found and selected then the condition can be populated and searched
		if (foundData) {
			this.s.data = loadedCriteria.data;
			this.s.origData = loadedCriteria.origData;
			this.s.dataIdx = dataIdx;
			this.c.orthogonal = this._getOptions().orthogonal;
			this.dom.dataTitle.remove();
			this._populateCondition();
			this.dom.conditionTitle.remove();
			let condition: string;

			// Check to see if the previously selected condition exists, if so select it
			let options = this.dom.condition.children('option');
			for(i = 0; i < options.length; i++) {
				let option = $(options[i]);

				if (
					loadedCriteria.condition !== undefined &&
					option.val() === loadedCriteria.condition &&
					typeof loadedCriteria.condition === 'string'
				) {
					option.prop('selected', true);
					condition = option.val() as string;
				}
				else {
					option.removeProp('selected');
				}
			}

			this.s.condition = condition;

			// If the condition has been found and selected then the value can be populated and searched
			if (this.s.condition !== undefined) {
				this.dom.conditionTitle.removeProp('selected');
				this.dom.conditionTitle.remove();
				this.dom.condition.removeClass(this.classes.italic);

				for (i = 0; i < options.length; i++) {
					let opt = $(options[i]);

					if(opt.val() !== this.s.condition) {
						opt.removeProp('selected');
					}
				}

				this._populateValue(loadedCriteria);
			}
			else {
				this.dom.conditionTitle.prependTo(this.dom.condition).prop('selected', true);
			}
		}
	}

	/**
	 * Sets the listeners for the criteria
	 */
	public setListeners(): void {
		this.dom.data
			.unbind('change')
			.on('change.dtsb', () => {
				this.dom.dataTitle.removeProp('selected');
				// Need to go over every option to identify the correct selection
				let options = this.dom.data.children('option.' + this.classes.option);

				for (let i = 0; i < options.length; i++) {
					let option = $(options[i]);
					if (option.val() === this.dom.data.val()) {
						this.dom.data.removeClass(this.classes.italic);
						option.prop('selected', true);
						this.s.dataIdx = +option.val();
						this.s.data = option.text();
						this.s.origData = option.prop('origData');

						this.c.orthogonal = this._getOptions().orthogonal;

						// When the data is changed, the values in condition and
						// value may also change so need to renew them
						this._clearCondition();
						this._clearValue();
						this._populateCondition();

						// If this criteria was previously active in the search then
						// remove it from the search and trigger a new search
						if (this.s.filled) {
							this.s.filled = false;
							this.doSearch();
							this.setListeners();
						}

						this.s.dt.state.save();
					}
					else {
						option.removeProp('selected');
					}
				}
			});

		this.dom.condition
			.unbind('change')
			.on('change.dtsb', () => {
				this.dom.conditionTitle.removeProp('selected');
				// Need to go over every option to identify the correct selection
				let options = this.dom.condition.children('option.'+this.classes.option);

				for(let i = 0; i < options.length; i++) {
					let option = $(options[i]);
					if(option.val() === this.dom.condition.val()) {
						this.dom.condition.removeClass(this.classes.italic);
						option.prop('selected', true);
						let condDisp = option.val();
						// Find the condition that has been selected and store it internally
						for (let cond of Object.keys(this.s.conditions)) {
							if (cond === condDisp) {
								this.s.condition = condDisp;
								break;
							}
						}

						// When the condition is changed, the value selector may switch between
						// a select element and an input element
						this._clearValue();
						this._populateValue();

						for (let val of this.dom.value) {
							// If this criteria was previously active in the search then remove
							// it from the search and trigger a new search
							if (this.s.filled && val !== undefined && this.dom.inputCont.has(val[0]).length !== 0) {
								this.s.filled = false;
								this.doSearch();
								this.setListeners();
							}
						}

						if (
							this.dom.value.length === 0 ||
							this.dom.value.length === 1 && this.dom.value[0] === undefined
						) {
							this.doSearch();
						}
					}
					else {
						option.removeProp('selected');
					}
				}
			});
	}

	public setupButtons() {
		if (window.innerWidth > 550) {
			this.dom.container.removeClass(this.classes.vertical);
			this.dom.buttons.css('left', null);
			this.dom.buttons.css('top', null);
			return;
		}
		this.dom.container.addClass(this.classes.vertical);
		this.dom.buttons.css('left', this.dom.data.innerWidth());
		this.dom.buttons.css('top', this.dom.data.position().top);
	}

	/**
	 * Builds the elements of the dom together
	 */
	private _buildCriteria(): void {
		// Append Titles for select elements
		this.dom.data.append(this.dom.dataTitle);
		this.dom.condition.append(this.dom.conditionTitle);

		// Add elements to container
		this.dom.container
			.append(this.dom.data)
			.append(this.dom.condition);

		this.dom.inputCont.empty();

		for (let val of this.dom.value) {
			val.append(this.dom.valueTitle);
			this.dom.inputCont.append(val);
		}

		// Add buttons to container
		this.dom.buttons
			.append(this.dom.delete)
			.append(this.dom.right);

		this.dom.container.append(this.dom.inputCont).append(this.dom.buttons);

		this.setListeners();
	}

	/**
	 * Clears the condition select element
	 */
	private _clearCondition(): void {
		this.dom.condition.empty();
		this.dom.conditionTitle.prop('selected', true).attr('disabled', 'true');
		this.dom.condition.prepend(this.dom.conditionTitle).prop('selectedIndex', 0);
		this.s.conditions = {};
		this.s.condition = undefined;
	}

	/**
	 * Clears the value elements
	 */
	private _clearValue(): void {
		let val;

		if (this.s.condition !== undefined) {
			if(this.dom.value.length > 0 && this.dom.value[0] !== undefined) {
				// Remove all of the value elements
				for (val of this.dom.value) {
					if(val !== undefined) {
						// Timeout is annoying but because of IOS
						setTimeout(function() {
							val.remove();
						}, 50);
					}
				}
			}

			// Call the init function to get the value elements for this condition
			this.dom.value = [].concat(this.s.conditions[this.s.condition].init(this, Criteria.updateListener));
			if(this.dom.value.length > 0 && this.dom.value[0] !== undefined) {
				this.dom.inputCont
					.empty()
					.append(this.dom.value[0])
					.insertAfter(this.dom.condition);
				$(this.dom.value[0]).trigger('dtsb-inserted');

				// Insert all of the value elements
				for (let i = 1; i < this.dom.value.length; i++) {
					this.dom.inputCont.append(this.dom.value[i]);
					$(this.dom.value[i]).trigger('dtsb-inserted');
				}
			}
		}
		else {
			// Remove all of the value elements
			for (val of this.dom.value) {
				if(val !== undefined) {
					// Timeout is annoying but because of IOS
					setTimeout(function() {
						val.remove();
					}, 50);
				}
			}

			// Append the default valueTitle to the default select element
			this.dom.valueTitle
				.prop('selected', true);
			this.dom.defaultValue
				.append(this.dom.valueTitle)
				.insertAfter(this.dom.condition);
		}

		this.s.value = [];
		this.dom.value = [
			$('<select disabled/>')
				.addClass(this.classes.value)
				.addClass(this.classes.dropDown)
				.addClass(this.classes.italic)
				.addClass(this.classes.select)
				.append(this.dom.valueTitle.clone())
		];
	}

	/**
	 * Gets the options for the column
	 *
	 * @returns {object} The options for the column
	 */
	private _getOptions(): {[keys: string]: any} {
		let table = this.s.dt;

		return $.extend(
			true,
			{},
			Criteria.defaults,
			table.settings()[0].aoColumns[this.s.dataIdx].searchBuilder
		);
	}

	/**
	 * Populates the condition dropdown
	 */
	private _populateCondition(): void {
		let conditionOpts: Array<JQuery<HTMLElement>> = [];
		let conditionsLength = Object.keys(this.s.conditions).length;
		let dt = this.s.dt;
		let colInits = dt.settings()[0].aoColumns;
		let column = +this.dom.data.children('option:selected').val();
		let condition, condName;

		// If there are no conditions stored then we need to get them from the appropriate type
		if (conditionsLength === 0) {
			this.s.type = dt.column(column).type();

			if(colInits !== undefined) {
				let colInit = colInits[column];
				if(colInit.searchBuilderType !== undefined && colInit.searchBuilderType !== null) {
					this.s.type = colInit.searchBuilderType;
				}
				else if (this.s.type === undefined || this.s.type === null) {
					this.s.type = colInit.sType;
				}
			}

			// If the column type is still unknown use the internal API to detect type
			if (this.s.type === null || this.s.type === undefined) {
				// This can only happen in DT1 - DT2 will do the invalidation of the type itself
				if ($.fn.dataTable.ext.oApi) {
					$.fn.dataTable.ext.oApi._fnColumnTypes(dt.settings()[0]);
				}

				this.s.type = dt.column(column).type();
			}

			// Enable the condition element
			this.dom.condition
				.removeAttr('disabled')
				.empty()
				.append(this.dom.conditionTitle)
				.addClass(this.classes.italic);
			this.dom.conditionTitle
				.prop('selected', true);

			let decimal = dt.settings()[0].oLanguage.sDecimal;

			// This check is in place for if a custom decimal character is in place
			if (decimal !== '' && this.s.type && this.s.type.indexOf(decimal) === this.s.type.length - decimal.length) {
				if (this.s.type.includes('num-fmt')) {
					this.s.type = this.s.type.replace(decimal, '');
				}
				else if (this.s.type.includes('num')) {
					this.s.type = this.s.type.replace(decimal, '');
				}
			}

			// Select which conditions are going to be used based on the column type
			let conditionObj: {[keys: string]: ICondition};
			
			if (this.c.conditions[this.s.type] !== undefined) {
				conditionObj = this.c.conditions[this.s.type]
			}
			else if (this.s.type && this.s.type.includes('datetime-')) {
				// Date / time data types in DataTables are driven by Luxon or
				// Moment.js.
				conditionObj = DataTable.use('moment')
					? this.c.conditions.moment
					: this.c.conditions.luxon;
				this.s.dateFormat = this.s.type.replace(/datetime-/g, '');
			}
			else if (this.s.type && this.s.type.includes('moment')) {
				conditionObj = this.c.conditions.moment;
				this.s.dateFormat = this.s.type.replace(/moment-/g, '');
			}
			else if (this.s.type && this.s.type.includes('luxon')) {
				conditionObj = this.c.conditions.luxon;
				this.s.dateFormat = this.s.type.replace(/luxon-/g, '');
			}
			else {
				conditionObj = this.c.conditions.string;
			}

			// Add all of the conditions to the select element
			for (
				condition of Object.keys(conditionObj)
			) {
				if (conditionObj[condition] !== null) {
					// Serverside processing does not supply the options for the select elements
					// Instead input elements need to be used for these instead
					if (dt.page.info().serverSide && conditionObj[condition].init === Criteria.initSelect) {
						let col = colInits[column];

						if (this.s.serverData && this.s.serverData[col.data]) {
							conditionObj[condition].init = Criteria.initSelectSSP;
							conditionObj[condition].inputValue = Criteria.inputValueSelect;
							conditionObj[condition].isInputValid = Criteria.isInputValidSelect;
						}
						else {
							conditionObj[condition].init = Criteria.initInput;
							conditionObj[condition].inputValue = Criteria.inputValueInput;
							conditionObj[condition].isInputValid = Criteria.isInputValidInput;
						}
					}

					this.s.conditions[condition] = conditionObj[condition];

					condName = conditionObj[condition].conditionName;
					if (typeof condName === 'function') {
						condName = condName(dt, this.c.i18n);
					}

					conditionOpts.push(
						$('<option>', {
							text : condName,
							value : condition,
						})
							.addClass(this.classes.option)
							.addClass(this.classes.notItalic)
					);
				}
			}
		}
		// Otherwise we can just load them in
		else if (conditionsLength > 0) {
			this.dom.condition.empty().removeAttr('disabled').addClass(this.classes.italic);

			for (condition of Object.keys(this.s.conditions)) {
				let name = this.s.conditions[condition].conditionName;
				
				if (typeof name === 'function') {
					name = name(dt, this.c.i18n);
				}

				let newOpt = $('<option>', {
					text : name,
					value : condition
				})
					.addClass(this.classes.option)
					.addClass(this.classes.notItalic);

				if (this.s.condition !== undefined && this.s.condition === name) {
					newOpt.prop('selected', true);
					this.dom.condition.removeClass(this.classes.italic);
				}

				conditionOpts.push(newOpt);
			}
		}
		else {
			this.dom.condition
				.attr('disabled', 'true')
				.addClass(this.classes.italic);

			return;
		}

		for (let opt of conditionOpts) {
			this.dom.condition.append(opt);
		}

		// Selecting a default condition if one is set
		if(colInits[column].searchBuilder && colInits[column].searchBuilder.defaultCondition) {
			let defaultCondition = colInits[column].searchBuilder.defaultCondition;

			// If it is a number just use it as an index
			if (typeof defaultCondition === 'number') {
				this.dom.condition.prop('selectedIndex', defaultCondition);
				this.dom.condition.trigger('change');
			}
			// If it is a string then things get slightly more tricly
			else if (typeof defaultCondition === 'string') {
				// We need to check each condition option to see if any will match
				for (let i = 0; i < conditionOpts.length; i++) {
					// Need to check against the stored conditions so we can match the token "cond" to the option
					for (let cond of Object.keys(this.s.conditions)) {
						condName = this.s.conditions[cond].conditionName;

						if (
							// If the conditionName matches the text of the option
							(typeof condName === 'string' ? condName : condName(dt, this.c.i18n)) ===
								conditionOpts[i].text() &&
							// and the tokens match
							cond === defaultCondition
						) {
							// Select that option
							this.dom.condition
								.prop(
									'selectedIndex',
									this.dom.condition.children().toArray().indexOf(conditionOpts[i][0])
								)
								.removeClass(this.classes.italic);
							this.dom.condition.trigger('change');
							i = conditionOpts.length;
							break;
						}
					}
				}
			}
		}
		// If not default set then default to 0, the title
		else {
			this.dom.condition.prop('selectedIndex', 0);
		}
	}

	/**
	 * Populates the data / column select element
	 */
	private _populateData(): void {
		let columns = this.s.dt.settings()[0].aoColumns;
		let includeColumns = this.s.dt.columns(this.c.columns).indexes().toArray();

		this.dom.data.empty().append(this.dom.dataTitle);

		for (let index=0 ; index<columns.length ; index++) {
			// Need to check that the column can be filtered on before adding it
			if (this.c.columns === true || includeColumns.includes(index)) {
				let col = columns[index];
				let opt = {
					index,
					origData: col.data,
					text: (col.searchBuilderTitle || col.sTitle)
						.replace(/(<([^>]+)>)/ig, '')
				};

				this.dom.data.append(
					$('<option>', {
						text : opt.text,
						value : opt.index
					})
						.addClass(this.classes.option)
						.addClass(this.classes.notItalic)
						.prop('origData', col.data)
						.prop('selected', this.s.dataIdx === opt.index ? true : false)
				);
	
				if(this.s.dataIdx === opt.index) {
					this.dom.dataTitle.removeProp('selected');
				}
			}
		}
	}

	/**
	 * Populates the Value select element
	 *
	 * @param loadedCriteria optional, used to reload criteria from predefined filters
	 */
	private _populateValue(loadedCriteria?): void {
		let prevFilled = this.s.filled;
		let i;

		this.s.filled = false;

		// Remove any previous value elements
		// Timeout is annoying but because of IOS
		setTimeout(() => {
			this.dom.defaultValue.remove();
		}, 50);

		for (let val of this.dom.value) {
			// Timeout is annoying but because of IOS
			setTimeout(function() {
				if(val !== undefined) {
					val.remove();
				}
			}, 50);
		}

		let children = this.dom.inputCont.children();
		if (children.length > 1) {
			for (i = 0; i < children.length; i++) {
				$(children[i]).remove();
			}
		}

		// Find the column with the title matching the data for the criteria and take note of the index
		if (loadedCriteria !== undefined) {
			this.s.dt.columns().every((index) => {
				if (this.s.dt.settings()[0].aoColumns[index].sTitle === loadedCriteria.data) {
					this.s.dataIdx = index;
				}
			});
		}

		// Initialise the value elements based on the condition
		this.dom.value = [].concat(this.s.conditions[this.s.condition].init(
			this,
			Criteria.updateListener,
			loadedCriteria !== undefined ? loadedCriteria.value : undefined
		));

		if (loadedCriteria !== undefined && loadedCriteria.value !== undefined) {
			this.s.value = loadedCriteria.value;
		}

		this.dom.inputCont.empty();

		// Insert value elements and trigger the inserted event
		if(this.dom.value[0] !== undefined) {
			$(this.dom.value[0])
				.appendTo(this.dom.inputCont)
				.trigger('dtsb-inserted');
		}

		for (i = 1; i < this.dom.value.length; i++) {
			$(this.dom.value[i])
				.insertAfter(this.dom.value[i - 1])
				.trigger('dtsb-inserted');
		}

		// Check if the criteria can be used in a search
		this.s.filled = this.s.conditions[this.s.condition].isInputValid(this.dom.value, this);
		this.setListeners();

		// If it can and this is different to before then trigger a draw
		if (!this.s.preventRedraw && prevFilled !== this.s.filled) {
			// If using SSP we want to restrict the amount of server calls that take place
			//  and this will already have taken place
			if (!this.s.dt.page.info().serverSide) {
				this.doSearch();
			}
			this.setListeners();
		}
	}

	/**
	 * Provides throttling capabilities to SearchBuilder without having to use dt's _fnThrottle function
	 * This is because that function is not quite suitable for our needs as it runs initially rather than waiting
	 *
	 * @param args arguments supplied to the throttle function
	 * @returns Function that is to be run that implements the throttling
	 */
	private _throttle(fn, frequency=200) {
		let last = null;
		let timer = null;
		let that = this;

		if(frequency === null) {
			frequency = 200;
		}

		return function(...args) {
			let now = +new Date();

			if (last !== null && now < last + frequency) {
				clearTimeout(timer);
			}
			else {
				last = now;
			}

			timer = setTimeout(function() {
				last = null;
				fn.apply(that, args);
			}, frequency);
		};
	}
}
