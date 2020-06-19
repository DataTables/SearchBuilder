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
			.on('change', function() {
				$(this).removeClass(Criteria.classes.italic);
				fn(that, this);
			});

		that.s.values = [];
		let added = [];
		let options = [];

		// Add all of the options from the table to the select element.
		// Only add one option for each possible value
		for (let index of indexArray) {
			let filter = settings.oApi._fnGetCellData(settings, index, column, that.c.orthogonal.search);

			let value = {
				filter,
				index,
				text: settings.oApi._fnGetCellData(settings, index, column, that.c.orthogonal.conditionName)
			};

			that.s.values.push(value);

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
			.dtDateTime()
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
				.dtDateTime()
				.on('input change', function() { fn(that, this); }),
			$('<span>')
				.addClass(that.classes.joiner)
				.text('and'),
			$('<input/>')
				.addClass(Criteria.classes.value)
				.addClass(Criteria.classes.input)
				.dtDateTime()
				.on('input change', function() { fn(that, this); }),
		];

		// If there are and preDefined values then add them
		if (preDefined !== null) {
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
	 * Default function for getting/setting select conditions
	 */
	private static inputValueSelect = function(el, value = null) {
		let values = [];

		// If there are no values to set
		if (value === null) {
			// Go through the select elements and push each selected option to the return array
			for (let element of el) {
				if ($(element).is('select')) {
					values.push($(element).children('option:selected').val());
				}
			}
		}
		else {
			// Set each select element if it exists
			for (let v = 0; v < el.length; v ++) {
				if ($(el[v]).is('select')) {
					let children = $(el[v]).children().toArray;

					for (let child of children) {
						if ($(child).val() === value[v]) {
							$(child).attr('selected', true);
							values.push(value[v]);
						}
					}
				}
			}
		}

		return values;
	};

	/**
	 * Default function for getting/setting input conditions
	 */
	private static inputValueInput = function(el, value = null) {
		let values = [];

		// If there are no values to set
		if (value === null) {
			// Go through the input elements and push each value to the return array
			for (let element of el) {
				if ($(element).is('input')) {
					values.push($(element).val());
				}
			}
		}
		else {
			// Set the value for each input element
			for (let v = 0; v < el.length; v++) {
				if ($(el[v]).is('input')) {
					$(el[v]).val(value[v]);
					values.push(value[v]);
				}
			}
		}

		return values;
	};

	/**
	 * Default function for getting/setting Moment conditions
	 */
	private static inputValueInputMoment = function(el, value = null, that) {
		let values = [];

		// If there are no values to set
		if (value === null) {
			// Go through the input elements and push each value to the return array
			for (let element of el) {
				if ($(element).is('input')) {
					// Having converted it to the correct format
					values.push(moment($(element).val()).format(that.s.momentFormat));
				}
			}
		}
		else {
			// Set the values for each of the input elements
			for (let v = 0; v < el.length; v++) {
				if ($(el[v]).is('input')) {
					$(el[v]).val(value[v]);
					values.push(value[v]);
				}
			}
		}

		return values;
	};

	/**
	 * Function that is run on each element as a call back when a search should be triggered
	 */
	private static updateListener = function(that, el) {
		// When the value is changed the criteria is now complete so can be included in searches
		that.s.filled = that.s.condition.isInputValid(that.dom.value, that);
		that.s.value = that.s.condition.inputValue(that.dom.value, undefined, that);

		let idx = null;
		let cursorPos = null;
		for (let i = 0; i < that.dom.value.length; i++) {
			if (el === that.dom.value[i][0]) {
				idx = i;
				cursorPos = el.selectionStart();
			}
		}

		// Trigger a search
		that.s.dt.draw();

		if (idx !== null) {
			$(that.dom.value[idx]).removeClass(that.classes.italic);
			$(that.dom.value[idx]).focus();
			$(that.dom.value[idx])[0].setSelectionRange(cursorPos, cursorPos);
		}
	};

	private static dateConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
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
		'<': {
			conditionName: 'Before',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value < comparison[0];
			},
		},
		'<<': {
			conditionName: 'Between Exclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return comparison[0] < value && value < comparison[1];
				}
				else {
					return comparison[1] < value && value < comparison[0];
				}
			},
		},
		'<=<=': {
			conditionName: 'Between Inclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return comparison[0] <= value && value <= comparison[1];
				}
				else {
					return comparison[1] <= value && value <= comparison[0];
				}
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value === comparison[0];
			},
		},
		'>': {
			conditionName: 'After',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				return value > comparison[0];
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
		'outwithExc': {
			conditionName: 'Outwith Exclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(comparison[0] <= value && value <= comparison[1]);
				}
				else {
					return !(comparison[1] <= value && value <= comparison[0]);
				}
			},
		},
		'outwithInc': {
			conditionName: 'Outwith Inclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(comparison[0] < value && value < comparison[1]);
				}
				else {
					return !(comparison[1] < value && value < comparison[0]);
				}
			},
		},
	};

	private static momentDateConditions: {[keys: string]: typeInterfaces.ICondition} = {
		'!=': {
			conditionName: 'Not',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInputMoment,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() !== moment(comparison[0], that.s.momentFormat).valueOf();
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
			inputValue: Criteria.inputValueInputMoment,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() < moment(comparison[0], that.s.momentFormat).valueOf();
			},
		},
		'<<': {
			conditionName: 'Between Exclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInputMoment,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				value = moment(value, that.s.momentFormat).valueOf();
				comparison[0] = moment(comparison[0], that.s.momentFormat).valueOf();
				comparison[1] = moment(comparison[1], that.s.momentFormat).valueOf();
				if (comparison[0] < comparison[1]) {
					return comparison[0] < value && value < comparison[1];
				}
				else {
					return comparison[1] < value && value < comparison[0];
				}
			},
		},
		'<=<=': {
			conditionName: 'Between Inclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInputMoment,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				value = moment(value, that.s.momentFormat).valueOf();
				comparison[0] = moment(comparison[0], that.s.momentFormat).valueOf();
				comparison[1] = moment(comparison[1], that.s.momentFormat).valueOf();
				if (comparison[0] < comparison[1]) {
					return comparison[0] <= value && value <= comparison[1];
				}
				else {
					return comparison[1] <= value && value <= comparison[0];
				}
			},
		},
		'=': {
			conditionName: 'Equals',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInputMoment,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() === moment(comparison[0], that.s.momentFormat).valueOf();
			},
		},
		'>': {
			conditionName: 'After',
			init: Criteria.initDate,
			inputValue: Criteria.inputValueInputMoment,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				return moment(value, that.s.momentFormat).valueOf() > moment(comparison[0], that.s.momentFormat).valueOf();
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
		'outwithExc': {
			conditionName: 'Outwith Exclusive',
			init: Criteria.init2Date,
			inputValue: Criteria.inputValueInputMoment,
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
		'outwithInc': {
			conditionName: 'Outwith Inclusive',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[], that): boolean {
				let val = moment(value, that.s.momentFormat).valueOf();
				let comp0 = moment(comparison[0], that.s.momentFormat).valueOf();
				let comp1 = moment(comparison[1], that.s.momentFormat).valueOf();
				if (comp0 < comp1) {
					return !(+comp0 < +val && +val < +comp1);
				}
				else {
					return !(+comp1 < +val && +val < +comp0);
				}
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
		'<<': {
			conditionName: 'Between Exclusive',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return +comparison[0] < +value && +value < +comparison[1];
				}
				else {
					return +comparison[1] < +value && +value < +comparison[0];
				}
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
		'<=<=': {
			conditionName: 'Between Inclusive',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return +comparison[0] <= +value && +value <= +comparison[1];
				}
				else {
					return +comparison[1] <= +value && +value <= +comparison[0];
				}
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
		'null': {
			conditionName: 'Empty',
			init() { return; },
			inputValue() { return; },
			isInputValid() { return true; },
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		},
		'outwithExc': {
			conditionName: 'Outwith Exclusive',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
		},
		'outwithInc': {
			conditionName: 'Outwith Inclusive',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] < +value && +value < +comparison[1]);
				}
				else {
					return !(+comparison[1] < +value && +value < +comparison[0]);
				}
			},
		},
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
		'<<': {
			conditionName: 'Between Exclusive',
			init: Criteria.init2Input,
			inputValue: Criteria.inputValueInput,
			isInputValid: Criteria.isInputValidInput,
			search(value: any, comparison: any[]): boolean {
				let val = value.replace(/[^0-9.]/g, '');
				let comp0 = comparison[0].replace(/[^0-9.]/g, '');
				let comp1 = comparison[1].replace(/[^0-9.]/g, '');
				if (comp0 < comp1) {
					return +comp0 < +val && +val < +comp1;
				}
				else {
					return +comp1 < +val && +val < +comp0;
				}
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
		'<=<=': {
			conditionName: 'Between Inclusive',
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
		'null': {
			conditionName: 'Empty',
			init() { return; },
			inputValue() { return; },
			isInputValid() { return true; },
			search(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		},
		'outwithExc': {
			conditionName: 'Outwith Exclusive',
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
		'outwithInc': {
			conditionName: 'Outwith Inclusive',
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
			conditionName: 'Ends with',
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
		allowed: true,
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
			conditions: [],
			data: -1,
			dataPoints: [],
			depth,
			dt: table,
			filled: false,
			index,
			momentFormat: false,
			topGroup,
			type: '',
			value: [],
			values: [],
		};

		this.dom = {
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
				.attr('title', this.s.dt.i18n('searchBuilder.deleteTitle', 'delete filtering rule')),
			left: $('<button>\<</button>')
				.addClass(this.classes.left)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.leftTitle', 'drop criteria')),
			right: $('<button>\></button>')
				.addClass(this.classes.right)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.rightTitle', 'idnent criteria')),
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
		$(this.dom.container)
			.empty()
			.append(this.dom.data)
			.append(this.dom.condition)
			.append(this.dom.value[0]);

		for (let i = 1; i < this.dom.value.length; i++) {
			$(this.dom.container)
				.append(this.dom.value[i]);
			$(this.dom.value[i]).trigger('dtsb-inserted');
		}

		$(this.dom.container).append(this.dom.delete);

		// If the depthLimit of the query has been hit then don't add the right button
		if ((this.c.depthLimit === false || this.s.depth < this.c.depthLimit) && hasSiblings) {
			$(this.dom.container).append(this.dom.right);
		}

		// If this is a top level criteria then don't let it move left
		if (this.s.depth > 1) {
			$(this.dom.container).append(this.dom.left);
		}

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
		if (this.s.condition !== undefined) {
			return this.s.condition.search(rowData[this.s.data], this.s.value, this);
		}
	}

	/**
	 * Gets the details required to rebuild the criteria
	 */
	public getDetails(): typeInterfaces.IDetails {
		return {
			condition: this.s.condition,
			data: this.s.data,
			type: 'criteria',
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

		if (this.s.data !== -1) {
			this._populateCondition();

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

		if (loadedCriteria.data !== -1) {
			let italic = this.classes.italic;
			let data = this.dom.data;

			$(this.dom.data).children('option').each(function() {
				if ($(this).val() === loadedCriteria.data) {
					$(this).attr('selected', true);
					$(data).removeClass(italic);
					foundData = true;
				}
			});
		}

		// If the data has been found and selected then the condition can be populated and searched
		if (foundData) {
			this.s.data = loadedCriteria.data;
			$(this.dom.dataTitle).remove();
			this._populateCondition();
			$(this.dom.conditionTitle).remove();
			let condition;
			let conditions = this.s.conditions;

			// Check to see if the previously selected condition exists, if so select it
			$(this.dom.condition).children('option').each(function() {
				if (
					(
						loadedCriteria.condition !== undefined &&
						$(this).val() === loadedCriteria.condition &&
						typeof loadedCriteria.condition === 'string'
					) ||
					(
						loadedCriteria.condition !== undefined &&
						$(this).val() === loadedCriteria.condition.conditionName
					)
				) {
					$(this).attr('selected', true);
					let condDisp = $(this).val();

					for (let cond of conditions) {
						if (cond.conditionName === condDisp) {
							condition = cond;

							return;
						}
					}
				}
			});

			this.s.condition = condition;

			// If the condition has been found and selected then the value can be populated and searched
			if (this.s.condition !== undefined) {
				$(this.dom.conditionTitle).remove();
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
			.unbind('change')
			.on('change', () => {
				$(this.dom.dataTitle).attr('selected', false);
				$(this.dom.data).removeClass(this.classes.italic);
				this.s.data = $(this.dom.data).children('option:selected').val();

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
			.unbind('change')
			.on('change', () => {
				$(this.dom.conditionTitle).attr('selected', false);
				$(this.dom.condition).removeClass(this.classes.italic);
				let condDisp = $(this.dom.condition).children('option:selected').val();

				for (let cond of this.s.conditions) {
					if (cond.conditionName === condDisp) {
						this.s.condition = cond;
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

				this.s.dt.state.save();
			});

		// When delete is pressed destroy this criteria
		$(this.dom.delete).unbind('change').on('click', () => {
			this.destroy();
			this.s.dt.draw();
			this.setListeners();

			return false;
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
		$(this.dom.container)
			.append(this.dom.data)
			.append(this.dom.condition);

		for (let val of this.dom.value) {
			$(val).append(this.dom.valueTitle);
			$(this.dom.container).append(val);
		}

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
		this.s.conditions = [];
		this.s.condition = undefined;
	}

	/**
	 * Clears the value elements
	 */
	private _clearValue(): void {
		if (this.s.condition !== undefined) {
			for (let val of this.dom.value) {
				$(val).remove();
			}

			let value = this.s.condition.init(this, Criteria.updateListener);
			this.dom.value = Array.isArray(value) ?
				value :
				[value];

			for (let val of this.dom.value) {
				$(val).insertAfter(this.dom.condition);
				$(val).trigger('dtsb-inserted');
			}
		}
		else {
			for (let val of this.dom.value) {
				$(val).remove();
			}

			$('.' + this.classes.joiner).remove();
			$(this.dom.valueTitle)
				.attr('selected', true)
				.attr('disabled', false);
			$(this.dom.defaultValue)
				.append(this.dom.valueTitle)
				.insertAfter(this.dom.condition);
		}

		this.s.values = [];
		this.s.value = [];
	}

	/**
	 * Populates the condition dropdown
	 */
	private _populateCondition(): void {
		let conditionOpts = [];
		// If there are no conditions stored then we need to get them from the appropriate type
		if (this.s.conditions.length === 0) {
			let column = $(this.dom.data).children('option:selected').val();
			this.s.type = this.s.dt.columns().type().toArray()[column];

			if (this.s.type === null) {
				this.s.dt.draw();
				this.setListeners();
				this.s.type = this.s.dt.columns().type().toArray()[column];
			}

			$(this.dom.condition)
				.attr('disabled', false)
				.empty()
				.append(this.dom.conditionTitle)
				.addClass(this.classes.italic);
			$(this.dom.conditionTitle)
				.attr('selected', true);

			let conditionObj = this.c.conditions[this.s.type] !== undefined ?
				this.c.conditions[this.s.type] :
				this.s.type.indexOf('moment') !== -1 && $.fn.dataTable.moment !== undefined ?
					this.c.conditions.moment :
					this.c.conditions.string;

			if (this.s.type.indexOf('moment') !== -1) {
				this.s.momentFormat = this.s.type.replace(/moment\-/g, '');
			}

			for (
				let condition of Object.keys(conditionObj)
			) {
				this.s.conditions.push(conditionObj[condition]);
				conditionOpts.push(
					$('<option>', {
						text : conditionObj[condition].conditionName,
						value : conditionObj[condition].conditionName,
					})
						.addClass(this.classes.option)
						.addClass(this.classes.notItalic)
				);
			}
		}
		// Otherwise we can just load them in
		else if (this.s.conditions.length > 0) {
			$(this.dom.condition).empty().attr('disabled', false).addClass(this.classes.italic);

			for (let condition of this.s.conditions) {
				let newOpt = $('<option>', {
					text : condition.conditionName,
					value : condition.conditionName
				})
					.addClass(this.classes.option)
					.addClass(this.classes.notItalic);

				if (this.s.condition !== undefined && this.s.condition.conditionName === condition.conditionName) {
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
		// If there are no datas stored then we need to get them from the table
		if (this.s.dataPoints.length === 0) {
			this.s.dt.columns().every((index) => {
				// Need to check that the column can be filtered on before adding it
				if (
					this.c.allowed === true ||
					(typeof this.c.allowed !== 'boolean' && this.c.allowed.length > 0 && this.c.allowed.indexOf(index) !== -1)
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
				let newOpt = $('<option>', {
					text : data.text,
					value : data.index
				})
					.addClass(this.classes.option)
					.addClass(this.classes.notItalic);

				if (+this.s.data === data.index) {
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

		$(this.dom.defaultValue).remove();

		for (let val of this.dom.value) {
			$(val).remove();
		}

		let value = this.s.condition.init(
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

		$(this.dom.value[0])
			.insertAfter(this.dom.condition)
			.trigger('dtsb-inserted');

		for (let i = 1; i < this.dom.value.length; i++) {
			$(this.dom.value[i])
				.insertAfter(this.dom.value[i - 1])
				.trigger('dtsb-inserted');
		}

		this.s.filled = this.s.condition.isInputValid(this.dom.value, this);
		this.setListeners();

		if (prevFilled !== this.s.filled) {
			this.s.dt.draw();
			this.setListeners();
		}
	}
}
