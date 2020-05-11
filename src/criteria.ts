
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

	private static dateConditions: typeInterfaces.ICondition[] = [
		{
			display: 'Equals',
			comparator(value: any, comparison: any[]): boolean {
				return value === comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'After',
			comparator(value: any, comparison: any[]): boolean {
				return value > comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'Before',
			comparator(value: any, comparison: any[]): boolean {
				return value < comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value: any, comparison: any[]): boolean {
				return value !== comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'Between Inclusive',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return comparison[0] <= value && value <= comparison[1];
				}
				else {
					return comparison[1] <= value && value <= comparison[0];
				}
			},
			joiner: 'and',
			type: 'date',
			valueInputs: 2
		},
		{
			display: 'Between Exclusive',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return comparison[0] < value && value < comparison[1];
				}
				else {
					return comparison[1] < value && value < comparison[0];
				}
			},
			joiner: 'and',
			type: 'date',
			valueInputs: 2
		}
	];

	private static numConditions: typeInterfaces.ICondition[] = [
		{
			display: 'Equals',
			comparator(value: any, comparison: any[]): boolean {
				return +value === +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Greater Than',
			comparator(value: any, comparison: any[]): boolean {
				return +value > +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than',
			comparator(value: any, comparison: any[]): boolean {
				return +value < +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Greater Than Equal To',
			comparator(value: any, comparison: any[]): boolean {
				return +value >= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than Equal To',
			comparator(value: any, comparison: any[]): boolean {
				return +value <= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value: any, comparison: any[]): boolean {
				return +value !== +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Between Exclusive',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return +comparison[0] < +value && +value < +comparison[1];
				}
				else {
					return +comparison[1] < +value && +value < +comparison[0];
				}
			},
			joiner: 'and',
			type: 'input',
			valueInputs: 2,
		},
		{
			display: 'Between Inclusive',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return +comparison[0] <= +value && +value <= +comparison[1];
				}
				else {
					return +comparison[1] <= +value && +value <= +comparison[0];
				}
			},
			joiner: 'and',
			type: 'input',
			valueInputs: 2
		},
		{
			display: 'Outwith Exclusive',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] <= +value && +value <= +comparison[1]);
				}
				else {
					return !(+comparison[1] <= +value && +value <= +comparison[0]);
				}
			},
			joiner: 'and',
			type: 'input',
			valueInputs: 2,
		},
		{
			display: 'Outwith Inclusive',
			comparator(value: any, comparison: any[]): boolean {
				if (comparison[0] < comparison[1]) {
					return !(+comparison[0] < +value && +value < +comparison[1]);
				}
				else {
					return !(+comparison[1] < +value && +value < +comparison[0]);
				}
			},
			joiner: 'and',
			type: 'input',
			valueInputs: 2
		}
	];

	private static numFmtConditions: typeInterfaces.ICondition[] = [
		{
			display: 'Equals',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value === +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Greater Than',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value > +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value < +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Greater Than Equal To',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value >= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than Equal To',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value <= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value: any, comparison: any[]): boolean {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value !== +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Between Exclusive',
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
			joiner: 'and',
			type: 'input',
			valueInputs: 2,
		},
		{
			display: 'Between Inclusive',
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
			joiner: 'and',
			type: 'input',
			valueInputs: 2
		},
		{
			display: 'Outwith Exclusive',
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
			joiner: 'and',
			type: 'input',
			valueInputs: 2,
		},
		{
			display: 'Outwith Inclusive',
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
			joiner: 'and',
			type: 'input',
			valueInputs: 2
		}
	];

	private static stringConditions: typeInterfaces.ICondition[] = [
		{
			display: 'Equals',
			comparator(value: any, comparison: any[]): boolean {
				return value === comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Starts With',
			comparator(value: any, comparison: any[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === 0;
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Ends with',
			comparator(value: any, comparison: any[]): boolean {
				return value.toLowerCase().indexOf(comparison[0].toLowerCase()) === value.length - comparison[0].length;
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Contains',
			comparator(value: any, comparison: any[]): boolean {
				return value.toLowerCase().includes(comparison[0].toLowerCase());
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value: any, comparison: any[]): boolean {
				return value !== comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
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

		// Get options from user
		this.c = $.extend(true, {}, Criteria.defaults, opts);

		this.s = {
			condition: '',
			conditions: [],
			data: undefined,
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
			right: $('<button disabled>\></button>')
				.addClass(this.classes.right)
				.addClass(this.classes.button)
				.attr('title', this.s.dt.i18n('searchBuilder.rightTitle', 'idnent criteria')),
			value: $('<select disabled/>').addClass(this.classes.value).addClass(this.classes.dropDown),
			valueInputs: [
				$('<input/>').addClass(this.classes.value).addClass(this.classes.input),
				$('<input/>').addClass(this.classes.value).addClass(this.classes.input)
			],
			valueTitle: $('<option value="" disabled selected hidden/>').text(this.s.dt.i18n('searchBuilder.value', 'Value')),
		};

		// If the greyscale option is selected then add the class to add the grey colour to SearchBuilder
		if (this.c.greyscale) {
			$(this.dom.data).addClass(this.classes.greyscale);
			$(this.dom.condition).addClass(this.classes.greyscale);
			$(this.dom.value).addClass(this.classes.greyscale);
			$(this.dom.valueInputs[0]).addClass(this.classes.greyscale);
			$(this.dom.valueInputs[1]).addClass(this.classes.greyscale);
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
	public updateArrows(hasSiblings = false): void {
		$(this.dom.container).empty();

		// Get the type of condition and the number of values required so we now how many value inputs to append
		let conditionType: string;
		let valCount: number;
		let joinerText: string;

		for (let opt of this.s.conditions) {
			if (opt.display === this.s.condition) {
				conditionType = opt.type;
				valCount = opt.valueInputs;
				joinerText = opt.joiner;
				break;
			}
		}

		$(this.dom.container).append(this.dom.data).append(this.dom.condition);

		// If it is an input condition then append everything in order and all of the input elements required
		if (conditionType === 'input') {
			$(this.dom.container.append(this.dom.valueInputs[0]));

			for (let i = 1; i < valCount && i < this.dom.valueInputs.length; i++) {
				$(this.dom.container
					.append($('<span>').addclass(this.classes.joiner).text(joinerText))
					.append(this.dom.valueInputs[i]));
			}
		}
		// If not then it must be a select or not defined yet, in which case should default to select
		else {
			$(this.dom.container).append(this.dom.value);
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

		// A different combination of arrows and selectors may lead to a need for responsive to be triggered
		this._adjustCriteria();
	}

	/**
	 * Destroys the criteria, removing listeners and container from the dom
	 */
	public destroy(): void {
		// Turn off listeners
		$(this.dom.data).off('.dtsb');
		$(this.dom.condition).off('.dtsb');
		$(this.dom.value).off('.dtsb');
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
		for (let condition of this.s.conditions) {
			if (condition.display === this.s.condition) {
				return condition.comparator(rowData[this.s.data], this.s.value);
			}
		}

		return false;
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

		if (this.s.data !== undefined) {
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
		$(this.dom.data).children('option').each(function() {
			if ($(this).val() === loadedCriteria.data) {
				$(this).attr('selected', true);
				foundData = true;
			}
		});

		// If the data has been found and selected then the condition can be populated and searched
		if (foundData) {
			this.s.data = loadedCriteria.data;
			$(this.dom.dataTitle).remove();
			this._populateCondition();

			// Check to see if the previously selected condition exists, if so select it
			let foundCond = false;
			$(this.dom.condition).children('option').each(function() {
				if ($(this).val() === loadedCriteria.condition) {
					$(this).attr('selected', true);
					foundCond = true;
				}
			});

			// If the condition has been found and selected then the value can be populated and searched
			if (foundCond) {
				this.s.condition = loadedCriteria.condition;
				$(this.dom.conditionTitle).remove();
				this._populateValue();

				// If it is a select condition
				if ($(this.dom.container).has(this.dom.value).length !== 0) {
					// Check to see if the previously selected value exists, if so select it
					let foundVal = false;
					$(this.dom.value).children('option').each(function() {
						if ($(this).val() === loadedCriteria.value[0]) {
							$(this).attr('selected', true);
							foundVal = true;
						}
					});

					// If the value has been found then set filled so that this criteria is used in searches
					if (foundVal) {
						this.s.filled = foundVal;
						this.s.value = loadedCriteria.value;
					}
				}
				// Otherwise it must be an input condition
				else {
					// Input values can just be given the stored values as there is nothing to select from
					$(this.dom.valueInputs[0]).val(loadedCriteria.value[0]);
					$(this.dom.valueInputs[1]).val(loadedCriteria.value[1]);

					this.s.value = loadedCriteria.value;

					// Run checks to see if the criteria is complete, to allow it to be included in the search
					let allFilled = true;

					// Check that all of the value inputs have been filled in
					for (let val = 0; val < this.dom.valueInputs.length; val++) {
						// If the value input is present and no value has been set in the array then it is not complete
						if (
							$(this.dom.container).has(this.dom.valueInputs[val]).length !== 0 &&
							(this.s.value[val] === undefined || this.s.value[val].length === 0)
						) {
							allFilled = false;
							break;
						}
					}

					this.s.filled = allFilled;
				}
			}
		}

		this.updateArrows();
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
			this.s.condition = $(this.dom.condition).children('option:selected').val();

			// When the condition is changed, the value selector may switch between a select element and an input element
			this._clearValue();
			this._populateValue();

			// If this criteria was previously active in the search then remove it from the search and trigger a new search
			if (this.s.filled) {
				this.s.filled = false;
				this.s.dt.draw();
			}

			this.s.dt.state.save();
		});

		$(this.dom.value).unbind('change');
		$(this.dom.value).on('change', () => {
			// When the value is changed the criteria is now complete so can be included in searches
			this.s.filled = true;

			// Deselect the title in the select element
			$(this.dom.valueTitle).attr('selected', false);
			this.s.value = [];
			this.s.value.push($(this.dom.value).children('option:selected').val());

			// Trigger a search
			this.s.dt.draw();

			this.s.dt.state.save();
		});

		// Set the listeners for all of the elements in the valueInputs array
		for (let i = 0; i < this.dom.valueInputs.length; i++) {
			$(this.dom.valueInputs[i]).unbind('input change');
			$(this.dom.valueInputs[i]).on('input change', () => {
				this.s.value[i] = $(this.dom.valueInputs[i]).val();
				let allFilled = true;

				// Check that all of the value inputs have been filled in
				for (let val = 0; val < this.dom.valueInputs.length; val++) {
					if (
						$(this.dom.container).has(this.dom.valueInputs[val]).length !== 0 &&
						(this.s.value[val] === undefined || this.s.value[val].length === 0)
					) {
						allFilled = false;
						break;
					}
				}

				this.s.filled = allFilled;
				this.s.dt.draw();
				$(this.dom.valueInputs[i]).focus();
			});
		}

		// When delete is pressed destroy this criteria
		$(this.dom.delete).unbind('change');
		$(this.dom.delete).on('click', () => {
			this.destroy();
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

		// Calculate the width and right value of the value input(s)/select element
		if ($(this.dom.container).has(this.dom.value).length !== 0) {
			valWidth =  $(this.dom.value).outerWidth(true);
			valRight = $(this.dom.value).offset().left + valWidth;
		}
		else if ($(this.dom.container).has(this.dom.valueInputs[1]).length !== 0) {
			let valWidthOuter = $(this.dom.valueInputs[1]).outerWidth(true);
			valWidth = valWidthOuter + $(this.dom.valueInputs[0]).outerWidth(true);
			valRight = $(this.dom.valueInputs[1]).offset().left + valWidthOuter;
		}
		else if ($(this.dom.container).has(this.dom.valueInputs[0]).length !== 0) {
			valWidth = $(this.dom.valueInputs[1]).outerWidth(true);
			valRight = $(this.dom.valueInputs[0]).offset().left + valWidth;
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
			(hasLeft && leftOffset.top !== rightOffset.top) ||
			(hasRight && rightOffset.top !== $(this.dom.delete).offset().top)
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
		$(this.dom.value).append(this.dom.valueTitle);
		$(this.dom.container)
			.append(this.dom.data)
			.append(this.dom.condition)
			.append(this.dom.value)
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
		$(this.dom.value).empty();

		for (let input of this.dom.valueInputs) {
			$(input).val('');
		}

		$(this.dom.valueTitle).attr('selected', true).attr('disabled', true);
		$(this.dom.value).append(this.dom.valueTitle);
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

				if (this.s.condition === condition.display) {
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
		let conditionType = 'select';
		let valCount = 1;
		let joinerText = 'and';
		this.s.filled = false;

		// Find the condition type and the number of value inputs required
		for (let opt of this.s.conditions) {
			if (opt.display === this.s.condition) {
				conditionType = opt.type;
				valCount = opt.valueInputs;
				joinerText = opt.joiner;
				break;
			}
		}

		// If the condition requires a selection from a select element
		if (conditionType === 'select') {
			// If there are input fields then remove them and add the select fields
			if ($(this.dom.container).has(this.dom.valueInputs[0]).length !== 0) {
				$(this.dom.value).insertBefore(this.dom.valueInputs[0]);
				$('.' + this.classes.joiner).remove();

				for (let input of this.dom.valueInputs) {
					$(input).remove();
				}

				this.setListeners();
			}

			$(this.dom.value).attr('disabled', false);

			// If there are no values set then we need to lead them in based on the columns data
			if (this.s.values.length === 0) {
				let column = $(this.dom.data).children('option:selected').val();
				let indexArray = this.s.dt.rows().indexes().toArray();
				let settings = this.s.dt.settings()[0];

				for (let index of indexArray) {
					let filter = settings.oApi._fnGetCellData(settings, index, column, this.c.orthogonal.search);
					let found = false;

					for (let val of this.s.values) {
						if (val.filter === filter) {
							found = true;
							break;
						}
					}

					if (!found) {
						let val = {filter, text: settings.oApi._fnGetCellData(settings, index, column, this.c.orthogonal.display), index};
						this.s.values.push(val);
						$(this.dom.value).append(
							$('<option>', {
								text : this.s.type.includes('html') ? val.text.replace(/(<([^>]+)>)/ig, '') : val.text,
								value : this.s.type.includes('html') ? val.filter.replace(/(<([^>]+)>)/ig, '') : val.filter
							})
							.addClass(this.classes.option)
						);
					}
				}
			}
			// Otherwise we can just load them in
			else {
				for (let val of this.s.values) {
					let newOpt = $('<option>', {
						text : val.text,
						value : val.filter
					})
					.addClass(this.classes.option);

					if (this.s.value[0] === val.filter) {
						$(newOpt).attr('selected', true);
						this.s.filled = true;
					}

					$(this.dom.value).append(newOpt);
				}
			}
		}
		// Otherwise it must be either an input or a date, both have very similar processes here
		// If the select element is present then
		else if (
			(conditionType === 'input' || conditionType === 'date') &&
			$(this.dom.container).has(this.dom.value).length !== 0
		) {
			$(this.dom.valueInputs[0]).insertBefore(this.dom.value);
			$(this.dom.valueInputs[0]).val(this.s.value[0]);

			// If it's a date then we need to initialise the DataTables datePicker
			if (conditionType === 'date') {
				$(this.dom.valueInputs[0]).dtDateTime();
			}

			// Insert all of the required valueInputs and update their values
			for (let i = 1; i < valCount && i < this.dom.valueInputs.length; i++) {
				// Insert a joiner span to break up the valueInputs
				$('<span>').addClass(this.classes.joiner).text(joinerText).insertBefore(this.dom.value);
				$(this.dom.valueInputs[i]).insertBefore(this.dom.value);
				$(this.dom.valueInputs[i]).val(this.s.value[i]);

				if (conditionType === 'date') {
					$(this.dom.valueInputs[i]).dtDateTime();
				}
			}

			$(this.dom.value).remove();
			this.setListeners();
		}
		// Otherwise if the input elements are present , but there are two and only one is needed
		else if (
			(conditionType === 'input' || conditionType === 'date') &&
			$(this.dom.container).has(this.dom.valueInputs[1]).length !== 0 &&
			valCount === 1
		) {
			$('.' + this.classes.joiner).remove();

			for (let i = 1; i < this.dom.valueInputs.length; i++) {
				$(this.dom.valueInputs[i]).remove();
			}
		}
	}

	/**
	 * Resets the value inputs to be an empty select
	 */
	private _resetValue(): void {
		if ($(this.dom.container).has(this.dom.valueInputs[0]).length !== 0) {
			$(this.dom.value).empty().append(this.dom.valueTitle).insertBefore(this.dom.valueInputs[0]);
			$(this.dom.valueInputs[0]).remove();
			$(this.dom.valueInputs[1]).remove();
			$('.' + this.classes.joiner).remove();
		}
	}
}
