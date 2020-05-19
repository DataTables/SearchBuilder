import 'datatables.net-datetime';
import * as typeInterfaces from './criteriaType';

let $: any;
let DataTable: any;

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
		joiner: 'dtsp-joiner',
		left: 'dtsb-left',
		option: 'dtsb-option',
		right: 'dtsb-right',
		value: 'dtsb-value',
		vertical: 'dtsb-vertical'
	};

	private static initSelect = function(that) {
		let select = $('<select/>').addClass(Criteria.classes.value).addClass(Criteria.classes.dropDown);
		$(select).append(that.dom.valueTitle);

		return select;
	};

	private static initInput = function(that) {
		return $('<input/>').addClass(Criteria.classes.value).addClass(Criteria.classes.input);
	};

	private static init2Input = function(that) {
		return [
			$('<input/>').addClass(Criteria.classes.value).addClass(Criteria.classes.input),
			$('<input/>').addClass(Criteria.classes.value).addClass(Criteria.classes.input)
		];
	};

	private static initDate = function(that) {
		return $('<input/>').addClass(Criteria.classes.value).addClass(Criteria.classes.input);
	};

	private static init2Date = function(that) {
		return [
			$('<input/>').addClass(Criteria.classes.value).addClass(Criteria.classes.input),
			$('<input/>').addClass(Criteria.classes.value).addClass(Criteria.classes.input)
		];
	};

	private static activeSelect = function(val, that) {
		$(that.dom.valueTitle).attr('selected', false);
		let allFilled = true;
		for (let v of val) {
			if ($(v).has('option:selected').length < 1) {
				allFilled = false;
			}
		}

		return allFilled;
	};

	private static activeInput = function(val, that) {
		let allFilled = true;
		for (let v of val) {
			if ($(v).val().length === 0) {
				allFilled = false;
			}
		}

		return allFilled;
	};

	private static activeDate = function(val) {
		let allFilled = true;
		for (let v of val) {
			if ($(v).val().length === 0) {
				allFilled = false;
			}
		}

		return allFilled;
	};

	private static getSelect = function(val, that) {
		let values = [];

		for (let v of val) {
			values.push($(v).children('option:selected').val());
		}

		return values;
	};

	private static getInput = function(val, that) {
		let values = [];

		for (let v of val) {
			values.push($(v).val());
		}

		return values;
	};

	private static getDate = function(val, that) {
		let values = [];

		for (let v of val) {
			values.push($(v).val());
		}

		return values;
	};

	private static setSelect = function(val, that) {
		let column = $(that.dom.data).children('option:selected').val();
		let indexArray = that.s.dt.rows().indexes().toArray();
		let settings = that.s.dt.settings()[0];

		for (let index of indexArray) {
			let filter = settings.oApi._fnGetCellData(settings, index, column, that.c.orthogonal.search);
			let found = false;

			for (let value of that.s.values) {
				if (value.filter === filter) {
					found = true;
					break;
				}
			}

			if (!found) {
				let value = {filter, text: settings.oApi._fnGetCellData(settings, index, column, that.c.orthogonal.display), index};
				that.s.values.push(value);
				for (let v of val) {
					$(v).append(
						$('<option>', {
							text : that.s.type.includes('html') ? value.text.replace(/(<([^>]+)>)/ig, '') : value.text,
							value : that.s.type.includes('html') ? value.filter.replace(/(<([^>]+)>)/ig, '') : value.filter
						})
						.addClass(that.classes.option)
					);
				}
			}
		}
	};

	private static setInput = function(val) {
		return;
	};

	private static setDate = function(val) {
		$(val).dtDateTime();
	};

	private static dateConditions: typeInterfaces.ICondition[] = [
		{
			active: Criteria.activeDate,
			display: 'Equals',
			get: Criteria.getDate,
			init: Criteria.initDate,
			set: Criteria.setDate,
			updateOn: 'change',
			comparator(value: any, comparison: any[]): boolean {
				return value === comparison[0];
			},
		},
		{
			active: Criteria.activeDate,
			display: 'After',
			get: Criteria.getDate,
			init: Criteria.initDate,
			set: Criteria.setDate,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return value > comparison[0];
			},
		},
		{
			active: Criteria.activeDate,
			display: 'Before',
			get: Criteria.getDate,
			init: Criteria.initDate,
			set: Criteria.setDate,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return value < comparison[0];
			},
		},
		{
			active: Criteria.activeDate,
			display: 'Not',
			get: Criteria.getDate,
			init: Criteria.initDate,
			set: Criteria.setDate,
			updateOn: 'change',
			comparator(value: any, comparison: any[]): boolean {
				return value !== comparison[0];
			},
		},
		{
			active: Criteria.activeDate,
			display: 'Between Inclusive',
			get: Criteria.getDate,
			init: Criteria.init2Date,
			joiner: 'and',
			set: Criteria.setDate,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return comparison[0] <= value && value <= comparison[1];
				}
				else {
					return comparison[1] <= value && value <= comparison[0];
				}
			},
		},
		{
			active: Criteria.activeDate,
			display: 'Between Exclusive',
			get: Criteria.getDate,
			init: Criteria.init2Date,
			joiner: 'and',
			set: Criteria.setDate,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return comparison[0] < value && value < comparison[1];
				}
				else {
					return comparison[1] < value && value < comparison[0];
				}
			},
		},
		{
			active() {
				return true;
			},
			display: 'Empty',
			init() {
				return;
			},
			get() {
				return;
			},
			set() {
				return;
			},
			updateOn: '',
			comparator(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		}
	];

	private static numConditions: typeInterfaces.ICondition[] = [
		{
			active: Criteria.activeSelect,
			display: 'Equals',
			get: Criteria.getSelect,
			init: Criteria.initSelect,
			set: Criteria.setSelect,
			updateOn: 'change',
			comparator(value: any, comparison: any[]): boolean {
				return +value === +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Greater Than',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return +value > +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Less Than',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return +value < +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Greater Than Equal To',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return +value >= +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Less Than Equal To',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return +value <= +comparison[0];
			},
		},
		{
			active: Criteria.activeSelect,
			display: 'Not',
			get: Criteria.getSelect,
			init: Criteria.initSelect,
			set: Criteria.setSelect,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return +value !== +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Between Exclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return +comparison[0] < +value && +value < +comparison[1];
				}
				else {
					return +comparison[1] < +value && +value < +comparison[0];
				}
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Between Inclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return +comparison[0] <= +value && +value <= +comparison[1];
				}
				else {
					return +comparison[1] <= +value && +value <= +comparison[0];
				}
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Outwith Exclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Outwith Inclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] < +value && +value < +comparison[1]);
				}
				else {
					return !(+comparison[1] < +value && +value < +comparison[0]);
				}
			},
		},
		{
			active() {
				return true;
			},
			display: 'Empty',
			init() {
				return;
			},
			get() {
				return;
			},
			set() {
				return;
			},
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		}
	];

	private static numFmtConditions: typeInterfaces.ICondition[] = [
		{
			active: Criteria.activeSelect,
			display: 'Equals',
			get: Criteria.getSelect,
			init: Criteria.initSelect,
			set: Criteria.setSelect,
			updateOn: 'change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value === +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Greater Than',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value > +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Less Than',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value < +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Greater Than Equal To',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value >= +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Less Than Equal To',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value <= +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Not',
			get: Criteria.getSelect,
			init: Criteria.initSelect,
			set: Criteria.setSelect,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value !== +comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Between Exclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');
				comparison[1] = comparison[1].replace(/[^0-9.]/g, '');
				if (comparison[0] < comparison[1]) {
					return +comparison[0] < +value && +value < +comparison[1];
				}
				else {
					return +comparison[1] < +value && +value < +comparison[0];
				}
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Between Inclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');
				comparison[1] = comparison[1].replace(/[^0-9.]/g, '');
				if (comparison[0] < comparison[1]) {
					return +comparison[0] <= +value && +value <= +comparison[1];
				}
				else {
					return +comparison[1] <= +value && +value <= +comparison[0];
				}
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Outwith Exclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');
				comparison[1] = comparison[1].replace(/[^0-9.]/g, '');
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Outwith Inclusive',
			get: Criteria.getInput,
			init: Criteria.init2Input,
			joiner: 'and',
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');
				comparison[1] = comparison[1].replace(/[^0-9.]/g, '');
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
		},
		{
			active() {
				return true;
			},
			display: 'Empty',
			init() {
				return;
			},
			get() {
				return;
			},
			set() {
				return;
			},
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		}
	];

	private static stringConditions: typeInterfaces.ICondition[] = [
		{
			active: Criteria.activeSelect,
			display: 'Equals',
			get: Criteria.getSelect,
			init: Criteria.initSelect,
			set: Criteria.setSelect,
			updateOn: 'change',
			comparator(value: any, comparison: any[]): boolean {
				return value === comparison[0];
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Starts With',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === 0;
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Ends with',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === value.length - comparison[0].length;
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Contains',
			get: Criteria.getInput,
			init: Criteria.initInput,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return value.toLowerCase().includes(comparison[0].toLowerCase());
			},
		},
		{
			active: Criteria.activeInput,
			display: 'Not',
			get: Criteria.getInput,
			init: Criteria.initSelect,
			set: Criteria.setInput,
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return value !== comparison[0];
			},
		},
		{
			active() {
				return true;
			},
			display: 'Empty',
			init() {
				return;
			},
			get() {
				return;
			},
			set() {
				return;
			},
			updateOn: 'input change',
			comparator(value: any, comparison: any[]): boolean {
				return (value === null || value === undefined || value.length === 0);
			},
		}
	];

	private static defaults: typeInterfaces.IDefaults = {
		allowed: true,
		conditions: {
			'date': Criteria.dateConditions,
			'html': Criteria.stringConditions,
			'html-num': Criteria.numConditions,
			'html-num-fmt': Criteria.numFmtConditions,
			'num': Criteria.numConditions,
			'num-fmt': Criteria.numFmtConditions,
			'string': Criteria.stringConditions
		},
		depthLimit: false,
		greyscale: false,
		orthogonal: {
			display: 'display',
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
			topGroup,
			type: '',
			value: [],
			values: [],
		};

		this.dom = {
			condition: $('<select disabled/>')
				.addClass(this.classes.condition)
				.addClass(this.classes.dropDown),
			conditionTitle: $('<option value="" disabled selected hidden/>').text(this.s.dt.i18n('searchBuilder.condition', 'Condition')),
			container: $('<div/>').addClass(this.classes.container),
			data: $('<select/>').addClass(this.classes.data).addClass(this.classes.dropDown),
			dataTitle: $('<option value="" disabled selected hidden/>').text(this.s.dt.i18n('searchBuilder.data', 'Data Point')),
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
			value: [$('<select disabled/>').addClass(this.classes.value).addClass(this.classes.dropDown)],
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
		$(this.dom.container).empty();

		// Get the type of condition and the number of values required so we now how many value inputs to append
		let joinerText = 'and';
		if (this.s.condition !== undefined) {
			joinerText = this.s.condition.joiner;
		}

		$(this.dom.container).append(this.dom.data).append(this.dom.condition);

		$(this.dom.container.append(this.dom.value[0]));

		for (let i = 1; i < this.dom.value.length; i++) {
			$(this.dom.container)
				.append($('<span>').addClass(this.classes.joiner).text(joinerText))
				.append(this.dom.value[i]);
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
		for (let val of this.dom.value) {
			$(val).off('.dtsb');
		}
		$(this.dom.delete).off('.dtsb');

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
			return this.s.condition.comparator(rowData[this.s.data], this.s.value);
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
			$(this.dom.data).children('option').each(function() {
				if ($(this).val() === loadedCriteria.data) {
					$(this).attr('selected', true);
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
				if ($(this).val() === loadedCriteria.condition) {
					$(this).attr('selected', true);
					let condDisp = $(this).val();
					for (let cond of conditions) {
						if (cond.display === condDisp) {
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
				this._populateValue();

				this.s.condition.set(loadedCriteria.value);
			}
			else {
				$(this.dom.conditionTitle).prependTo(this.dom.condition);
				$(this.dom.conditionTitle).attr('selected', true);
			}
		}
	}

	/**
	 * Sets the listeners for the criteria
	 */
	public setListeners(): void {
		$(this.dom.data).unbind('change');
		$(this.dom.data).on('change', () => {
			$(this.dom.dataTitle).attr('selected', false);
			this.s.data = $(this.dom.data).children('option:selected').val();

			// When the data is changed, the values in condition and value may also change so need to renew them
			this._clearCondition();
			this._clearValue();
			this._resetValue();
			this._populateCondition();

			// If this criteria was previously active in the search then remove it from the search and trigger a new search
			if (this.s.filled) {
				this.s.filled = false;
				this.s.dt.draw();
			}

			this.s.dt.state.save();
		});

		$(this.dom.condition).unbind('change');
		$(this.dom.condition).on('change', () => {
			$(this.dom.conditionTitle).attr('selected', false);
			let condDisp = $(this.dom.condition).children('option:selected').val();
			for (let cond of this.s.conditions) {
				if (cond.display === condDisp) {
					this.s.condition = cond;
					break;
				}
			}

			// When the condition is changed, the value selector may switch between a select element and an input element
			this._clearValue();
			this._populateValue();

			for (let val of this.dom.value) {
				// If this criteria was previously active in the search then remove it from the search and trigger a new search
				if (
					this.s.filled &&
					(
						$(this.dom.container).has(val).length !== 0
					)
				) {
					this.s.filled = false;
					this.s.dt.draw();
				}
			}

			this.s.dt.state.save();
		});

		if (this.s.condition !== undefined) {
			for (let val of this.dom.value) {
				$(val).unbind(this.s.condition.updateOn);
				$(val).on(this.s.condition.updateOn, () => {
					// When the value is changed the criteria is now complete so can be included in searches
					this.s.filled = this.s.condition.active(this.dom.value, this);
					this.s.value = this.s.condition.get(this.dom.value, this);

					// Trigger a search
					this.s.dt.draw();

					this.s.dt.state.save();

					$(val).focus();
				});
			}
		}

		// When delete is pressed destroy this criteria
		$(this.dom.delete).unbind('change');
		$(this.dom.delete).on('click', () => {
			this.destroy();
			this.s.dt.draw();

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
	}

	/**
	 * Clears the value elements
	 */
	private _clearValue(): void {
		if (this.s.condition !== undefined) {
			for (let val of this.dom.value) {
				$(val).remove();
			}
			let value = this.s.condition.init(this);
			this.dom.value = Array.isArray(value) ?
				value :
				[value];
			for (let val of this.dom.value) {
				$(val).insertAfter(this.dom.condition);
			}
		}

		this.s.values = [];
		this.s.value = [];
	}

	/**
	 * Populates the condition dropdown
	 */
	private _populateCondition(): void {
		// If there are no conditions stored then we need to get them from the appropriate type
		if (this.s.conditions.length === 0) {
			let column = $(this.dom.data).children('option:selected').val();
			this.s.type = this.s.dt.columns().type().toArray()[column];

			if (this.s.type === null) {
				this.s.dt.draw();
				this.s.type = this.s.dt.columns().type().toArray()[column];
			}

			if (this.c.conditions[this.s.type] !== undefined) {
				$(this.dom.condition).attr('disabled', false);
				for (let condition of this.c.conditions[this.s.type]) {
					this.s.conditions.push(condition);
					$(this.dom.condition).append(
						$('<option>', {
							text : condition.display,
							value : condition.display,
						})
						.addClass(this.classes.option)
					);
				}
			}
		}
		// Otherwise we can just load them in
		else if (this.s.conditions.length > 1) {
			$(this.dom.condition).attr('disabled', false);

			for (let condition of this.s.conditions) {
				let newOpt = $('<option>', {
					text : condition.display,
					value : condition.display
				})
				.addClass(this.classes.option);

				if (this.s.condition !== undefined && this.s.condition.display === condition.display) {
					$(newOpt).attr('selected', true);
				}

				$(this.dom.condition).append(newOpt);
			}
		}
		else {
			$(this.dom.condition).attr('disabled', true);
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
				.addClass(this.classes.option);

				if (+this.s.data === data.index) {
					$(newOpt).attr('selected', true);
				}

				$(this.dom.data).append(newOpt);
			}
		}
	}

	/**
	 * Populates the Value select element
	 */
	private _populateValue(): void {
		let prevFilled = this.s.filled;
		this.s.filled = false;

		for (let val of this.dom.value) {
			$(val).remove();
		}

		let value = this.s.condition.init(this);
		this.dom.value = Array.isArray(value) ?
			value :
			[value];

		let joinerText = 'and';
		if (this.s.condition !== undefined) {
			joinerText = this.s.condition.joiner;
		}

		$(this.dom.value[0]).insertAfter(this.dom.condition);

		for (let i = 1; i < this.dom.value.length; i++) {
			$(this.dom.value[i]).insertAfter(this.dom.value[i - 1]);
			$($('<span>').addClass(this.classes.joiner).text(joinerText)).insertAfter(this.dom.value[i - 1]);
		}

		if (this.s.condition !== undefined) {
			this.s.condition.set(this.dom.value, this);
			this.setListeners();
		}

		if (prevFilled !== this.s.filled) {
			this.s.dt.draw();
		}
	}

	/**
	 * Resets the value inputs to be an empty select
	 */
	private _resetValue(): void {
		if (this.s.condition !== undefined) {
			for (let val of this.dom.value) {
				$(val).remove();
			}
			let value = this.s.condition.init(this);
			this.dom.value = Array.isArray(value) ?
				value :
				[value];
			for (let val of this.dom.value) {
				$(val).insertAfter(this.dom.condition);
			}
		}
	}
}
