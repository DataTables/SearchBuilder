import 'datatables.net-datetime';
import * as typeInterfaces from './criteriaType';

let $: any;
let DataTable: any;
const moment = (window as any).moment;

/**
 * Sets the value of jQuery for use in the file
 * @param jq the instance of jQuery to be set
 */
export function setJQuery(jq: any): void {
  $ = jq;
  DataTable = jq.fn.dataTable;
}

/**
 * The Criteria class is used within SearchBuilder to represent a search criteria
 */
export default class Criteria {
	private static version = '0.0.1';

	private static classes: typeInterfaces.IClasses = {
		button: 'dtsb-button',
		buttonContainer: 'dtsb-buttonContainer',
		condition: 'dtsb-condition',
		container: 'dtsb-criteria',
		data: 'dtsb-data',
		delete: 'dtsb-delete',
		dropDown: 'dtsb-dropDown',
		greyscale: 'dtsb-greyscale',
		input: 'dtsb-input',
		italic: 'dtsb-italic',
		joiner: 'dtsp-joiner',
		left: 'dtsb-left',
		notItalic: 'dtsb-notItalic',
		option: 'dtsb-option',
		right: 'dtsb-right',
		value: 'dtsb-value',
		vertical: 'dtsb-vertical'
	};

	/**
	 * Default initialisation function for select conditions
	 */
	private static initSelect = function(that, fn, preDefined = null) {
		let column = $(that.dom.data).children('option:selected').val();
		let indexArray = that.s.dt.rows().indexes().toArray();
		let settings = that.s.dt.settings()[0];

		// Declare select element to be used with all of the default classes and listeners.
		let el = $('<select/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.dropDown)
			.addClass(Criteria.classes.italic)
			.append(that.dom.valueTitle)
			.on('input', function() {
				$(this).removeClass(Criteria.classes.italic);
				fn(that, this);
			});

		let added = [];
		let options = [];

		// Add all of the options from the table to the select element.
		// Only add one option for each possible value
		for (let index of indexArray) {
			let value = {
				filter: settings.oApi._fnGetCellData(settings, index, column, that.c.orthogonal.search),
				index,
				text: settings.oApi._fnGetCellData(settings, index, column, 'display')
			};

			// Add text and value, stripping out any html if that is the column type
			let opt = $('<option>', {
				text : that.s.type.includes('html') ? value.text.replace(/(<([^>]+)>)/ig, '') : value.text,
				value : that.s.type.includes('html') ? value.filter.replace(/(<([^>]+)>)/ig, '') : value.filter
			})
				.addClass(that.classes.option)
				.addClass(that.classes.notItalic);

			let val = $(opt).val();

				// Check that this value has not already been added
			if (added.indexOf(val) === -1) {
				// $(el).append(opt);
				added.push(val);
				options.push(opt);

				// If this value was previously selected as indicated by preDefined, then select it again
				if (preDefined !== null && opt.val() === preDefined[0]) {
					opt.attr('selected', true);
					that.dom.valueTitle.remove();
					$(el).removeClass(Criteria.classes.italic);
				}
			}
		}

		options.sort((a, b) => {
			if (that.s.type === 'string' || that.s.type === 'num' || that.s.type === 'html' || that.s.type === 'html-num') {
				if ($(a).val() < $(b).val()) {
					return -1;
				}
				else if ($(a).val() < $(b).val()) {
					return 1;
				}
				else {
					return 0;
				}
			}
			else if (that.s.type === 'num-fmt' || that.s.type === 'html-num-fmt') {
				if (+$(a).val().replace(/[^0-9.]/g, '') < +$(b).val().replace(/[^0-9.]/g, '')) {
					return -1;
				}
				else if (+$(a).val().replace(/[^0-9.]/g, '') < +$(b).val().replace(/[^0-9.]/g, '')) {
					return 1;
				}
				else {
					return 0;
				}
			}
		});

		for (let opt of options) {
			$(el).append(opt);
		}

		return el;
	};

	/**
	 * Default initialisation function for input conditions
	 */
	private static initInput = function(that, fn, preDefined = null) {
		// Declare the input element
		let el = $('<input/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.input)
			.on('input', function() { fn(that, this); });

		// If there is a preDefined value then add it
		if (preDefined !== null) {
			$(el).val(preDefined[0]);
		}

		return el;
	};

	/**
	 * Default initialisation function for conditions requiring 2 inputs
	 */
	private static init2Input = function(that, fn, preDefined = null) {
		// Declare all of the necessary jQuery elements
		let els = [
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.on('input', function() { fn(that, this); }),
			$('<span>')
				.addClass(that.classes.joiner).text('and'),
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.on('input', function() { fn(that, this); }),
		];

		// If there is a preDefined value then add it
		if (preDefined !== null) {
			$(els[0]).val(preDefined[0]);
			$(els[2]).val(preDefined[1]);
		}

		return els;
	};

	/**
	 * Default initialisation function for date conditions
	 */
	private static initDate = function(that, fn, preDefined = null) {
		// Declare date element using DataTables dateTime plugin
		let el = $('<input/>')
			.addClass(Criteria.classes.value)
			.addClass(Criteria.classes.input)
			.dtDateTime({
				attachTo: 'input',
				format: that.s.momentFormat ? that.s.momentFormat : undefined
			})
			.on('input change', function() { fn(that, this); });

		// If there is a preDefined value then add it
		if (preDefined !== null) {
			$(el).val(preDefined[0]);
		}

		return el;
	};

	private static init2Date = function(that, fn, preDefined = null) {
		// Declare all of the date elements that are required using DataTables dateTime plugin
		let els = [
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.dtDateTime({
					attachTo: 'input',
					format: that.s.momentFormat ? that.s.momentFormat : undefined
				})
				.on('input change', function() { fn(that, this); }),
			$('<span>')
				.addClass(that.classes.joiner)
				.text('and'),
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.dtDateTime({
					attachTo: 'input',
					format: that.s.momentFormat ? that.s.momentFormat : undefined
				})
				.on('input change', function() { fn(that, this); }),
		];

		// If there are and preDefined values then add them
		if (preDefined !== null && preDefined.length > 0) {
			$(els[0]).val(preDefined[0]);
			$(els[2]).val(preDefined[1]);
		}

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
				$(element).children('option:selected').length === $(element).children('option').length - $(element).children('option.' + Criteria.classes.notItalic).length &&
				$(element).children('option:selected').length === 1 &&
				$(element).children('option:selected')[0] === $(element).children('option:hidden')[0]
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
			if ($(element).is('input') && $(element).val().length === 0) {
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
			if ($(element).is('select')) {
				values.push($(element).children('option:selected').val());
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
			if ($(element).is('input')) {
				values.push($(element).val());
			}
		}

		return values;
	};

	/**
	 * Function that is run on each element as a call back when a search should be triggered
	 */
	private static updateListener = function(that, el) {
		// When the value is changed the criteria is now complete so can be included in searches
		// Get the condition from the map based on the key that has been selected for the condition
		let condition = that.s.conditions.get(that.s.condition);
		that.s.filled = condition.isInputValid(that.dom.value, that);
		that.s.value = condition.inputValue(that.dom.value, that);

		// Take note of the cursor position so that we can refocus there later
		let idx: number = null;
		let cursorPos: number = null;
		for (let i = 0; i < that.dom.value.length; i++) {
			if (el === that.dom.value[i][0]) {
				idx = i;

				if (el.selectionStart !== undefined) {
					cursorPos = el.selectionStart;
				}
			}
		}

		// Trigger a search
		that.s.dt.draw();

		// Refocus the element and set the correct cursor position
		if (idx !== null) {
			$(that.dom.value[idx]).removeClass(that.classes.italic);
			$(that.dom.value[idx]).focus();

			if (cursorPos !== null) {
				$(that.dom.value[idx])[0].setSelectionRange(cursorPos, cursorPos);
			}
		}
	};

	private static dateConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				value = value.replace(/(\/|\-|\,)/g, '-');

				return value !== comparison[0];
			},
		},
		'!between': {
			conditionName: 'Not Between',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				value = value.replace(/(\/|\-|\,)/g, '-');
				if (comparison[0] < comparison[1]) {
					return !(comparison[0] <= value && value <= comparison[1]);
				}
				else {
					return !(comparison[1] <= value && value <= comparison[0]);
				}
			},
		},
		'!null': {
			conditionName: 'Not Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		},
		'<': {
			conditionName: 'Before',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				value = value.replace(/(\/|\-|\,)/g, '-');

				return value < comparison[0];
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				value = value.replace(/(\/|\-|\,)/g, '-');

				return value === comparison[0];
			},
		},
		'>': {
			conditionName: 'After',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				value = value.replace(/(\/|\-|\,)/g, '-');

				return value > comparison[0];
			},
		},
		'between': {
			conditionName: 'Between',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				value = value.replace(/(\/|\-|\,)/g, '-');
				if (comparison[0] < comparison[1]) {
					return comparison[0] <= value && value <= comparison[1];
				}
				else {
					return comparison[1] <= value && value <= comparison[0];
				}
			},
		},
		'null': {
			conditionName: 'Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		},
	};

	private static momentDateConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() !== moment(comparison[0], that.s.momentFormat).valueOf();
			},
		},
		'!between': {
			conditionName: 'Not Between',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				let val = moment(value, that.s.momentFormat).valueOf();
				let comp0 = moment(comparison[0], that.s.momentFormat).valueOf();
				let comp1 = moment(comparison[1], that.s.momentFormat).valueOf();
				if (comp0 < comp1) {
					return !(+comp0 <= +val && +val <= +comp1);
				}
				else {
					return !(+comp1 <= +val && +val <= +comp0);
				}
			},
		},
		'!null': {
			conditionName: 'Not Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		},
		'<': {
			conditionName: 'Before',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() < moment(comparison[0], that.s.momentFormat).valueOf();
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() === moment(comparison[0], that.s.momentFormat).valueOf();
			},
		},
		'>': {
			conditionName: 'After',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() > moment(comparison[0], that.s.momentFormat).valueOf();
			},
		},
		'between': {
			conditionName: 'Between',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				let val = moment(value, that.s.momentFormat).valueOf();
				let comp0 = moment(comparison[0], that.s.momentFormat).valueOf();
				let comp1 = moment(comparison[1], that.s.momentFormat).valueOf();
				if (comp0 < comp1) {
					return comp0 <= val && val <= comp1;
				}
				else {
					return comp1 <= val && val <= comp0;
				}
			},
		},
		'null': {
			conditionName: 'Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		},
	};

	private static numConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: any, comparison: any[]): boolean {
				return +value !== +comparison[0];
			},
		},
		'!between': {
			conditionName: 'Not Between',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (+comparison[0] < +comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
		},
		'!null': {
			conditionName: 'Not Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		},
		'<': {
			conditionName: 'Less Than',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return +value < +comparison[0];
			},
		},
		'<=': {
			conditionName: 'Less Than Equal To',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return +value <= +comparison[0];
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: any, comparison: any[]): boolean {
				return +value === +comparison[0];
			},
		},
		'>': {
			conditionName: 'Greater Than',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return +value > +comparison[0];
			},
		},
		'>=': {
			conditionName: 'Greater Than Equal To',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return +value >= +comparison[0];
			},
		},
		'between': {
			conditionName: 'Between',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (+comparison[0] < +comparison[1]) {
					return +comparison[0] <= +value && +value <= +comparison[1];
				}
				else {
					return +comparison[1] <= +value && +value <= +comparison[0];
				}
			},
		},
		'null': {
			conditionName: 'Empty',
			init() { return; },
			inputValue() { return; },
			isInputValid() { return true; },
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		}
	};

	private static numFmtConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp = comparison[0].replace(/[^0-9.]/g, '');

				return +val !== +comp;
			},
		},
		'!between': {
			conditionName: 'Not Between',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');
				let comp1 = comparison[1].replace(/[^0-9.]/g, '');
				if (comp0 < comp1) {
					return !(+comp0 <= +val && +val <= +comp1);
				}
				else {
					return !(+comp1 <= +val && +val <= +comp0);
				}
			},
		},
		'!null': {
			conditionName: 'Not Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		},
		'<': {
			conditionName: 'Less Than',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp = comparison[0].replace(/[^0-9.]/g, '');

				return +val < +comp;
			},
		},
		'<=': {
			conditionName: 'Less Than Equal To',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');

				return +val <= +comp0;
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');

				return +val === +comp0;
			},
		},
		'>': {
			conditionName: 'Greater Than',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');

				return +val > +comp0;
			},
		},
		'>=': {
			conditionName: 'Greater Than Equal To',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');

				return +val >= +comp0;
			},
		},
		'between': {
			conditionName: 'Between',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');
				let comp1 = comparison[1].replace(/[^0-9.]/g, '');
				if (comp0 < comp1) {
					return +comp0 <= +val && +val <= +comp1;
				}
				else {
					return +comp1 <= +val && +val <= +comp0;
				}
			},
		},
		'null': {
			conditionName: 'Empty',
			init() { return; },
			inputValue() { return; },
			isInputValid() { return true; },
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		}
	};

	private static stringConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value !== comparison[0];
			},
		},
		'!null': {
			conditionName: 'Not Empty',
			isInputValid() { return true; },
			init() { return; },
			inputValue() {
				return;
			},
			search(value: any, comparison: any[]): boolean {
				return !(value === null || value === undefined || value.length === 0);
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initSelect,
			inputValue: Criteria.inputValueSelect,
			isInputValid: Criteria.isInputValidSelect,
			search(value: any, comparison: any[]): boolean {
				return value === comparison[0];
			},
		},
		'contains': {
			conditionName: 'Contains',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value.toLowerCase().includes(comparison[0].toLowerCase());
			},
		},
		'ends': {
			conditionName: 'Ends With',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === value.length - comparison[0].length;
			},
		},
		'null': {
			conditionName: 'Empty',
			init() { return; },
			inputValue() { return; },
			isInputValid() { return true; },
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		},
		'starts': {
			conditionName: 'Starts With',
			init: Criteria.initInput,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === 0;
			},
		},
	};

	private static defaults: typeInterfaces.IDefaults = {
		columns: true,
		conditions: {
			'date': Criteria.dateConditions,
			'html': Criteria.stringConditions,
			'html-num': Criteria.numConditions,
			'html-num-fmt': Criteria.numFmtConditions,
			'moment': Criteria.momentDateConditions,
			'num': Criteria.numConditions,
			'num-fmt': Criteria.numFmtConditions,
			'string': Criteria.stringConditions
		},
		depthLimit: false,
		greyscale: false,
		orthogonal: {
			conditionName: 'Condition Name',
			search: 'filter',
		}
	};

	public classes: typeInterfaces.IClasses;
	public dom: typeInterfaces.IDom;
	public c: typeInterfaces.IDefaults;
	public s: typeInterfaces.IS;

	constructor(table: any, opts: any, topGroup: JQuery<HTMLElement>, index: number = 0, depth: number = 1) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
			throw new Error('SearchPane requires DataTables 1.10 or newer');
		}

		this.classes = $.extend(true, {}, Criteria.classes);

		// Get options from user and any extra conditions/column types defined by plug-ins
		this.c = $.extend(true, {}, Criteria.defaults, $.fn.dataTable.ext.searchBuilder, opts);

		this.s = {
			condition: undefined,
			conditions: new Map(),
			data: undefined,
			dataIdx: -1,
			dataPoints: [],
			depth,
			dt: table,
			filled: false,
			index,
			momentFormat: false,
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
				.addClass(this.classes.italic),
			conditionTitle: $('<option value="" disabled selected hidden/>')
				.text(this.s.dt.i18n('searchBuilder.condition', 'Condition')),
			container: $('<div/>')
				.addClass(this.classes.container),
			data: $('<select/>')
				.addClass(this.classes.data)
				.addClass(this.classes.dropDown)
				.addClass(this.classes.italic),
			dataTitle: $('<option value="" disabled selected hidden/>')
				.text(this.s.dt.i18n('searchBuilder.data', 'Data')),
			defaultValue: $('<select disabled/>')
				.addClass(this.classes.value)
				.addClass(this.classes.dropDown),
			delete: $('<button>&times</button>')
				.addClass(this.classes.delete)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.deleteTitle', 'Delete filtering rule')),
			left: $('<button>\<</button>')
				.addClass(this.classes.left)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.leftTitle', 'Outdent criteria')),
			right: $('<button>\></button>')
				.addClass(this.classes.right)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.rightTitle', 'Indent criteria')),
			value: [
				$('<select disabled/>').addClass(this.classes.value).addClass(this.classes.dropDown).addClass(this.classes.italic)
			],
			valueTitle: $('<option value="" disabled selected hidden/>').text(this.s.dt.i18n('searchBuilder.value', 'Value')),
		};

		// If the greyscale option is selected then add the class to add the grey colour to SearchBuilder
		if (this.c.greyscale) {
			$(this.dom.data).addClass(this.classes.greyscale);
			$(this.dom.condition).addClass(this.classes.greyscale);

			for (let val of this.dom.value) {
				$(val).addClass(this.classes.greyscale);
			}
		}

		// For responsive design, adjust the criterias properties on the following events
		this.s.dt.on('draw.dtsp', () => {
			this._adjustCriteria();
		});

		this.s.dt.on('buttons-action', () => {
			this._adjustCriteria();
		});

		$(window).on('resize.dtsp', DataTable.util.throttle(() => {
			this._adjustCriteria();
		}));

		this._buildCriteria();

		return this;
	}

	/**
	 * Adds the left button to the criteria
	 */
	public updateArrows(hasSiblings = false, redraw = true): void {
		// Empty the container and append all of the elements in the correct order
		$(this.dom.container)
			.empty()
			.append(this.dom.data)
			.append(this.dom.condition)
			.append(this.dom.value[0]);

		// Trigger the inserted events for the value elements as they are inserted
		$(this.dom.value[0]).trigger('dtsb-inserted');

		for (let i = 1; i < this.dom.value.length; i++) {
			$(this.dom.container).append(this.dom.value[i]);
			$(this.dom.value[i]).trigger('dtsb-inserted');
		}

		// If this is a top level criteria then don't let it move left
		if (this.s.depth > 1) {
			$(this.dom.buttons).append(this.dom.left);
		}

		// If the depthLimit of the query has been hit then don't add the right button
		if ((this.c.depthLimit === false || this.s.depth < this.c.depthLimit) && hasSiblings) {
			$(this.dom.buttons).append(this.dom.right);
		}

		$(this.dom.buttons).append(this.dom.delete);
		$(this.dom.container).append(this.dom.buttons);

		if (redraw) {
			// A different combination of arrows and selectors may lead to a need for responsive to be triggered
			this._adjustCriteria();
		}
	}

	/**
	 * Destroys the criteria, removing listeners and container from the dom
	 */
	public destroy(): void {
		// Turn off listeners
		$(this.dom.data).off('.dtsb');
		$(this.dom.condition).off('.dtsb');
		$(this.dom.delete).off('.dtsb');

		for (let val of this.dom.value) {
			$(val).off('.dtsb');
		}

		// Remove container from the dom
		$(this.dom.container).remove();
	}

	/**
	 * Passes in the data for the row and compares it against this single criteria
	 * @param rowData The data for the row to be compared
	 * @returns boolean Whether the criteria has passed
	 */
	public search(rowData: any[]): boolean {
		let condition = this.s.conditions.get(this.s.condition);
		if (this.s.condition !== undefined &&  condition !== undefined) {
			return condition.search(rowData[this.s.dataIdx], this.s.value, this);
		}
	}

	/**
	 * Gets the details required to rebuild the criteria
	 */
	public getDetails(): typeInterfaces.IDetails {
		return {
			condition: this.s.condition,
			data: this.s.data,
			value: this.s.value
		};
	}

	/**
	 * Getter for the node for the container of the criteria
	 * @returns JQuery<HTMLElement> the node for the container
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
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
	 * @param loadedCriteria the details required to rebuild the criteria
	 */
	public rebuild(loadedCriteria: typeInterfaces.IDetails): void {
		// Check to see if the previously selected data exists, if so select it
		let foundData = false;
		let dataIdx;
		this._populateData();

		// If a data selection has previously been made attempt to find and select it
		if (loadedCriteria.data !== undefined) {
			let italic = this.classes.italic;
			let data = this.dom.data;

			$(this.dom.data).children('option').each(function() {
				if ($(this).text() === loadedCriteria.data) {
					$(this).attr('selected', true);
					$(data).removeClass(italic);
					foundData = true;
					dataIdx = $(this).val();
				}
			});
		}

		// If the data has been found and selected then the condition can be populated and searched
		if (foundData) {
			this.s.data = loadedCriteria.data;
			this.s.dataIdx = dataIdx;
			$(this.dom.dataTitle).remove();
			this._populateCondition();
			$(this.dom.conditionTitle).remove();
			let condition: string;
			let conditions = this.s.conditions;

			// Check to see if the previously selected condition exists, if so select it
			$(this.dom.condition).children('option').each(function() {
				if (
					(
						loadedCriteria.condition !== undefined &&
						$(this).val() === loadedCriteria.condition &&
						typeof loadedCriteria.condition === 'string'
					)
				) {
					$(this).attr('selected', true);
					condition = $(this).val();
				}
			});

			this.s.condition = condition;

			// If the condition has been found and selected then the value can be populated and searched
			if (this.s.condition !== undefined) {
				$(this.dom.conditionTitle).remove();
				$(this.dom.condition).removeClass(this.classes.italic);
				this._populateValue(loadedCriteria);
			}
			else {
				$(this.dom.conditionTitle).prependTo(this.dom.condition).attr('selected', true);
			}
		}
	}

	/**
	 * Sets the listeners for the criteria
	 */
	public setListeners(): void {
		$(this.dom.data)
			.unbind('input')
			.on('input', () => {
				$(this.dom.dataTitle).attr('selected', false);
				$(this.dom.data).removeClass(this.classes.italic);
				this.s.dataIdx = $(this.dom.data).children('option:selected').val();
				this.s.data = $(this.dom.data).children('option:selected').text();

				// When the data is changed, the values in condition and value may also change so need to renew them
				this._clearCondition();
				this._clearValue();
				this._populateCondition();

				// If this criteria was previously active in the search then remove it from the search and trigger a new search
				if (this.s.filled) {
					this.s.filled = false;
					this.s.dt.draw();
					this.setListeners();
				}

				this.s.dt.state.save();
			});

		$(this.dom.condition)
			.unbind('input')
			.on('input', () => {
				$(this.dom.conditionTitle).attr('selected', false);
				$(this.dom.condition).removeClass(this.classes.italic);
				let condDisp = $(this.dom.condition).children('option:selected').val();

				// Find the condition that has been selected and store it internally
				for (let cond of Array.from(this.s.conditions.keys())) {
					if (cond === condDisp) {
						this.s.condition = condDisp;
						break;
					}
				}

				// When the condition is changed, the value selector may switch between a select element and an input element
				this._clearValue();
				this._populateValue();

				for (let val of this.dom.value) {
					// If this criteria was previously active in the search then remove it from the search and trigger a new search
					if (this.s.filled && $(this.dom.container).has(val).length !== 0) {
						this.s.filled = false;
						this.s.dt.draw();
						this.setListeners();
					}
				}

				this.s.dt.draw();
			});

	}

	/**
	 * Adjusts the criteria to make SearchBuilder responsive
	 */
	private _adjustCriteria(): void {
		// If this criteria is not present then don't bother adjusting it
		if ($(document).has(this.dom.container).length === 0) {
			return;
		}

		let valRight: number;
		let valWidth: number;
		let outmostval = this.dom.value[this.dom.value.length - 1];

		// Calculate the width and right value of the outmost value element
		if ($(this.dom.container).has(outmostval).length !== 0) {
			valWidth =  $(outmostval).outerWidth(true);
			valRight = $(outmostval).offset().left + valWidth;
		}
		else {
			return;
		}

		let leftOffset = $(this.dom.left).offset();
		let rightOffset = $(this.dom.right).offset();
		let clearOffset = $(this.dom.delete).offset();
		let hasLeft = $(this.dom.container).has(this.dom.left).length !== 0;
		let hasRight = $(this.dom.container).has(this.dom.right).length !== 0;
		let buttonsLeft = hasLeft ?
			leftOffset.left :
			hasRight ?
				rightOffset.left :
				clearOffset.left;

		// Perform the responsive calculations and redraw where necessary
		if (
			buttonsLeft - valRight < 15 ||
			(hasLeft && leftOffset.top !== clearOffset.top) ||
			(hasRight && rightOffset.top !== clearOffset.top)
		) {
			$(this.dom.container).parent().addClass(this.classes.vertical);
			$(this.s.topGroup).trigger('dtsb-redrawContents');
		}
		else if (
			buttonsLeft -
			(
				$(this.dom.data).offset().left +
				$(this.dom.data).outerWidth(true) +
				$(this.dom.condition).outerWidth(true) +
				valWidth
			) > 15
		) {
			$(this.dom.container).parent().removeClass(this.classes.vertical);
			$(this.s.topGroup).trigger('dtsb-redrawContents');
		}
	}

	/**
	 * Builds the elements of the dom together
	 */
	private _buildCriteria(): void {
		// Append Titles for select elements
		$(this.dom.data).append(this.dom.dataTitle);
		$(this.dom.condition).append(this.dom.conditionTitle);

		// Add elements to container
		$(this.dom.container)
			.append(this.dom.data)
			.append(this.dom.condition);

		for (let val of this.dom.value) {
			$(val).append(this.dom.valueTitle);
			$(this.dom.container).append(val);
		}

		// Add buttons to container
		$(this.dom.container)
			.append(this.dom.delete)
			.append(this.dom.right);

		this.setListeners();
	}

	/**
	 * Clears the condition select element
	 */
	private _clearCondition(): void {
		$(this.dom.condition).empty();
		$(this.dom.conditionTitle).attr('selected', true).attr('disabled', true);
		$(this.dom.condition).append(this.dom.conditionTitle);
		this.s.conditions = new Map();
		this.s.condition = undefined;
	}

	/**
	 * Clears the value elements
	 */
	private _clearValue(): void {
		if (this.s.condition !== undefined) {
			// Remove all of the value elements
			for (let val of this.dom.value) {
				$(val).remove();
			}

			// Call the init function to get the value elements for this condition
			let value = this.s.conditions.get(this.s.condition).init(this, Criteria.updateListener);
			this.dom.value = Array.isArray(value) ?
				value :
				[value];

			$(this.dom.value[0]).insertAfter(this.dom.condition).trigger('dtsb-inserted');

			// Insert all of the value elements
			for (let i = 1; i < this.dom.value.length; i++) {
				$(this.dom.value[i]).insertAfter(this.dom.value[i - 1]).trigger('dtsb-inserted');
			}
		}
		else {
			// Remove all of the value elements
			for (let val of this.dom.value) {
				$(val).remove();
			}

			// Append the default valueTitle to the default select element
			$(this.dom.valueTitle)
				.attr('selected', true)
				.attr('disabled', false);
			$(this.dom.defaultValue)
				.append(this.dom.valueTitle)
				.insertAfter(this.dom.condition);
		}

		this.s.value = [];
	}

	/**
	 * Populates the condition dropdown
	 */
	private _populateCondition(): void {
		let conditionOpts: Array<JQuery<HTMLElement>> = [];
		// If there are no conditions stored then we need to get them from the appropriate type
		if (this.s.conditions.size === 0) {
			let column = $(this.dom.data).children('option:selected').val();
			this.s.type = this.s.dt.columns().type().toArray()[column];

			// If the column type is unknown, call a draw to try reading it again
			if (this.s.type === null) {
				this.s.dt.draw();
				this.setListeners();
				this.s.type = this.s.dt.columns().type().toArray()[column];
			}

			// Enable the condition element
			$(this.dom.condition)
				.attr('disabled', false)
				.empty()
				.append(this.dom.conditionTitle)
				.addClass(this.classes.italic);
			$(this.dom.conditionTitle)
				.attr('selected', true);

			// Select which conditions are going to be used based on the column type
			let conditionObj = this.c.conditions[this.s.type] !== undefined ?
				this.c.conditions[this.s.type] :
				this.s.type.indexOf('moment') !== -1 && $.fn.dataTable.moment !== undefined ?
					this.c.conditions.moment :
					this.c.conditions.string;

			// If it is a moment format then extract the date format
			if (this.s.type.indexOf('moment') !== -1) {
				this.s.momentFormat = this.s.type.replace(/moment\-/g, '');
			}

			// Add all of the conditions to the select element
			for (
				let condition of Object.keys(conditionObj)
			) {
				if (conditionObj[condition] !== null) {
					this.s.conditions.set(condition, conditionObj[condition]);
					conditionOpts.push(
						$('<option>', {
							text : conditionObj[condition].conditionName,
							value : condition,
						})
							.addClass(this.classes.option)
							.addClass(this.classes.notItalic)
					);
				}
			}
		}
		// Otherwise we can just load them in
		else if (this.s.conditions.size > 0) {
			$(this.dom.condition).empty().attr('disabled', false).addClass(this.classes.italic);

			for (let condition of Array.from(this.s.conditions.keys())) {
				let condName = this.s.conditions.get(condition).conditionName;
				let newOpt = $('<option>', {
					text : condName,
					value : condition
				})
					.addClass(this.classes.option)
					.addClass(this.classes.notItalic);

				if (this.s.condition !== undefined && this.s.condition === condName) {
					$(newOpt).attr('selected', true);
					$(this.dom.condition).removeClass(this.classes.italic);
				}

				conditionOpts.push(newOpt);
			}
		}
		else {
			$(this.dom.condition)
				.attr('disabled', true)
				.addClass(this.classes.italic);

			return;
		}

		// Sort the conditions so that they are displayed alphabetically
		conditionOpts.sort((a, b) => {
			if ($(a).val() < $(b).val()) {
				return -1;
			}
			else if ($(a).val() < $(b).val()) {
				return 1;
			}
			else {
				return 0;
			}
		});

		for (let opt of conditionOpts) {
			$(this.dom.condition).append(opt);
		}

	}

	/**
	 * Populates the data select element
	 */
	private _populateData(): void {
		$(this.dom.data).empty().append(this.dom.dataTitle);
		// If there are no datas stored then we need to get them from the table
		if (this.s.dataPoints.length === 0) {
			this.s.dt.columns().every((index) => {
				// Need to check that the column can be filtered on before adding it
				if (
					this.c.columns === true ||
					(this.s.dt.columns(this.c.columns).indexes().toArray().indexOf(index) !== -1)
				) {
					let found = false;

					for (let val of this.s.dataPoints) {
						if (val.index === index) {
							found = true;
							break;
						}
					}

					if (!found) {
						let opt = {text: this.s.dt.settings()[0].aoColumns[index].sTitle, index};
						this.s.dataPoints.push(opt);
						$(this.dom.data).append(
							$('<option>', {
								text : opt.text,
								value : opt.index
							})
								.addClass(this.classes.option)
								.addClass(this.classes.notItalic)
						);
					}
				}
			});
		}
		// Otherwise we can just load them in
		else {
			for (let data of this.s.dataPoints) {
				this.s.dt.columns().every((index) => {
					if (this.s.dt.settings()[0].aoColumns[index].sTitle === data.text) {
						data.index = index;
					}
				});
				let newOpt = $('<option>', {
					text : data.text,
					value : data.index
				})
					.addClass(this.classes.option)
					.addClass(this.classes.notItalic);

				if (this.s.data === data.text) {
					this.s.dataIdx = data.index;
					$(newOpt).attr('selected', true);
					$(this.dom.data).removeClass(this.classes.italic);
				}

				$(this.dom.data).append(newOpt);
			}
		}
	}

	/**
	 * Populates the Value select element
	 * @param loadedCriteria optional, used to reload criteria from predefined filters
	 */
	private _populateValue(loadedCriteria?): void {
		let prevFilled = this.s.filled;
		this.s.filled = false;

		// Remove any previous value elements
		$(this.dom.defaultValue).remove();

		for (let val of this.dom.value) {
			$(val).remove();
		}

		let children = $(this.dom.container).children();
		if (children.length > 3) {
			for (let i = 2; i < children.length - 1; i++) {
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
		let value = this.s.conditions.get(this.s.condition).init(
			this,
			Criteria.updateListener,
			loadedCriteria !== undefined ? loadedCriteria.value : undefined
		);

		if (loadedCriteria !== undefined && loadedCriteria.value !== undefined) {
			this.s.value = loadedCriteria.value;
		}

		this.dom.value = Array.isArray(value) ?
			value :
			[value];

		// Insert value elements and trigger the inserted event
		$(this.dom.value[0])
			.insertAfter(this.dom.condition)
			.trigger('dtsb-inserted');

		for (let i = 1; i < this.dom.value.length; i++) {
			$(this.dom.value[i])
				.insertAfter(this.dom.value[i - 1])
				.trigger('dtsb-inserted');
		}

		// Check if the criteria can be used in a search
		this.s.filled = this.s.conditions.get(this.s.condition).isInputValid(this.dom.value, this);
		this.setListeners();

		// If it can and this is different to before then trigger a draw
		if (prevFilled !== this.s.filled) {
			this.s.dt.draw();
			this.setListeners();
		}
	}
}
