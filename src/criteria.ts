
import 'datatables.net-datetime';

let $;
let DataTable;

/**
 * Sets the value of jQuery for use in the file
 * @param jq the instance of jQuery to be set
 */
export function setJQuery(jq) {
  $ = jq;
  DataTable = jq.fn.dataTable;
}

/**
 * The Criteria class is used within SearchBuilder to represent a search criteria
 */
export default class Criteria {
	private static version = '0.0.1';

	private static classes = {
		condition: 'dtsb-condition',
		container: 'dtsb-criteria',
		delete: 'dtsb-delete',
		dropDown: 'dtsb-dropDown',
		field: 'dtsb-field',
		input: 'dtsb-input',
		joiner: 'dtsp-joiner',
		left: 'dtsb-left',
		option: 'dtsb-option',
		right: 'dtsb-right',
		roundButton: 'dtsb-rndbtn',
		value: 'dtsb-value'
	};

	private static dateConditions = [
		{
			display: 'Equals',
			comparator(value, comparison) {
				return value === comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'After',
			comparator(value, comparison) {
				return value > comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'Before',
			comparator(value, comparison) {
				return value < comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value, comparison) {
				return value !== comparison[0];
			},
			type: 'date',
			valueInputs: 1
		},
		{
			display: 'Between Inclusive',
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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

	private static numConditions = [
		{
			display: 'Equals',
			comparator(value, comparison) {
				return +value === +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Greater Than',
			comparator(value, comparison) {
				return +value > +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than',
			comparator(value, comparison) {
				return +value < +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Greater Than Equal To',
			comparator(value, comparison) {
				return +value >= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than Equal To',
			comparator(value, comparison) {
				return +value <= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value, comparison) {
				return +value !== +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Between Exclusive',
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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

	private static numFmtConditions = [
		{
			display: 'Equals',
			comparator(value, comparison) {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value === +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Greater Than',
			comparator(value, comparison) {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value > +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than',
			comparator(value, comparison) {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value < +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Greater Than Equal To',
			comparator(value, comparison) {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value >= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Less Than Equal To',
			comparator(value, comparison) {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value <= +comparison[0];
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value, comparison) {
				value = value.replace(/[^0-9.]/g, '');
				comparison[0] = comparison[0].replace(/[^0-9.]/g, '');

				return +value !== +comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Between Exclusive',
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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
			comparator(value, comparison) {
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

	private static stringConditions = [
		{
			display: 'Equals',
			comparator(value, comparison) {
				return value === comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
		{
			display: 'Starts With',
			comparator(value, comparison) {
				return value.toLowerCase().indexOf(comparison[0]) === 0;
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Ends with',
			comparator(value, comparison) {
				return value.toLowerCase().indexOf(comparison[0]) === value.length - comparison[0].length;
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Contains',
			comparator(value, comparison) {
				return value.toLowerCase().includes(comparison[0]);
			},
			type: 'input',
			valueInputs: 1
		},
		{
			display: 'Not',
			comparator(value, comparison) {
				return value !== comparison[0];
			},
			type: 'select',
			valueInputs: 1
		},
	];

	private static defaults = {
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
		orthogonal: {
			display: 'display',
			hideCount: false,
			search: 'filter',
			show: undefined,
			sort: 'sort',
			threshold: 0.6,
			type: 'type'
		}
	};

	public classes;
	public dom;
	public c;
	public s;

	constructor(table, opts, index = 0, depth = 1) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
			throw new Error('SearchPane requires DataTables 1.10 or newer');
		}

		this.classes = $.extend(true, {}, Criteria.classes);

		// Get options from user
		this.c = $.extend(true, {}, Criteria.defaults, opts);

		this.s = {
			conditions: [],
			depth,
			dt: table,
			fields: [],
			filled: false,
			index,
			type: '',
			values: []
		};

		this.dom = {
			condition: $('<select/>')
				.addClass(this.classes.condition)
				.addClass(this.classes.dropDown)
				.addClass(this.classes.disabled),
			conditionTitle: $('<option value="" disabled selected hidden/>').text('Condition'),
			container: $('<div/>').addClass(this.classes.container),
			delete: $('<button>x</button>').addClass(this.classes.delete).addClass(this.classes.roundButton),
			field: $('<select/>').addClass(this.classes.field).addClass(this.classes.dropDown),
			fieldTitle: $('<option value="" disabled selected hidden/>').text('Field'),
			left: $('<button>&#x2190;</button>').addClass(this.classes.left).addClass(this.classes.roundButton),
			right: $('<button disabled>&#x2192;</button>').addClass(this.classes.right).addClass(this.classes.roundButton),
			value: $('<select/>').addClass(this.classes.value).addClass(this.classes.dropDown).addClass(this.classes.disabled),
			valueInputs: [
				$('<input/>').addClass(this.classes.value).addClass(this.classes.input).addClass(this.classes.disabled),
				$('<input/>').addClass(this.classes.value).addClass(this.classes.input).addClass(this.classes.disabled)
			],
			valueTitle: $('<option value="" disabled selected hidden/>').text('Value'),
		};

		this._buildCriteria();
	}

	/**
	 * Adds the left button to the criteria
	 */
	public updateArrows(): void {
		$(this.dom.container).empty();

		// Get the type of condition and the number of values required so we now how many value inputs to append
		let conditionType;
		let valCount;
		let joinerText;

		for (let opt of this.s.conditions) {
			if (opt.display === this.s.condition) {
				conditionType = opt.type;
				valCount = opt.valueInputs;
				joinerText = opt.joiner;
				break;
			}
		}

		$(this.dom.container).append(this.dom.field).append(this.dom.condition);

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

		if (this.c.depthLimit === false || this.s.depth < this.c.depthLimit) {
			$(this.dom.container).append(this.dom.right);
		}

		if (this.s.depth > 1) {
			$(this.dom.container).append(this.dom.left);
		}
	}

	/**
	 * Destroys the criteria, removing listeners and container from the dom
	 */
	public destroy(): void {
		// Turn off listeners
		$(this.dom.field).off('.dtsb');
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
	public search(rowData): boolean {
		for (let condition of this.s.conditions) {
			if (condition.display === this.s.condition) {
				return condition.comparator(rowData[this.s.field], this.s.value);
			}
		}

		return false;
	}

	/**
	 * Getter for the node for the container of the criteria
	 * @returns JQuery<HTMLElement> the node for the container
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
	}

	/**
	 * Populates the criteria field, condition and value(s) as far as has been selected
	 */
	public populate(): void {
		this._populateField();

		if (this.s.field !== undefined) {
			this._populateCondition();

			if (this.s.condition !== undefined) {
				this._populateValue();
			}
		}
	}

	/**
	 * Sets the listeners for the criteria
	 */
	public setListeners(): void {
		$(this.dom.field).unbind('change');
		$(this.dom.field).on('change', () => {
			$(this.dom.fieldTitle).attr('selected', false);
			this.s.field = $(this.dom.field).children('option:selected').val();
			this._clearCondition();
			this._clearValue();
			this._populateCondition();
			this.s.dt.draw();
		});

		$(this.dom.condition).unbind('change');
		$(this.dom.condition).on('change', () => {
			$(this.dom.conditionTitle).attr('selected', false);
			this.s.condition = $(this.dom.condition).children('option:selected').val();
			this._clearValue();
			this._populateValue();
			this.s.dt.draw();
		});

		$(this.dom.value).unbind('change');
		$(this.dom.value).on('change', () => {
			this.s.filled = true;
			$(this.dom.valueTitle).attr('selected', false);
			this.s.value = [];
			this.s.value.push($(this.dom.value).children('option:selected').val());
			this.s.dt.draw();
		});

		for (let i = 0; i < this.dom.valueInputs.length; i++) {
			$(this.dom.valueInputs[i]).unbind('input change');
			$(this.dom.valueInputs[i]).on('input change', () => {
				this.s.value[i] = $(this.dom.valueInputs[i]).val();
				let allFilled = true;

				// Check that all of the value inputs have been filled in
				for (let val = 0; val < this.dom.valueInputs.length; val++) {
					if (
						$(document).has(this.dom.valueInputs[val]).length !== 0 &&
						(this.s.value[val] === undefined || this.s.value[val].length === 0)
					) {
						allFilled = false;
						break;
					}
				}

				this.s.filled = allFilled;
				this.s.dt.draw();
			});
		}

		$(this.dom.delete).unbind('change');
		$(this.dom.delete).on('click', () => {
			this.destroy();
			this.s.dt.draw();
		});
	}

	/**
	 * Builds the elements of the dom together
	 */
	private _buildCriteria(): void {
		$(this.dom.field).append(this.dom.fieldTitle);
		$(this.dom.condition).append(this.dom.conditionTitle);
		$(this.dom.value).append(this.dom.valueTitle);
		$(this.dom.container)
			.append(this.dom.field)
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
		$(this.dom.conditionTitle).attr('selected', true);
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

		$(this.dom.valueTitle).attr('selected', true);
		$(this.dom.value).append(this.dom.valueTitle);
		this.s.values = [];
		this.s.value = [];
	}

	/**
	 * Populates the condition dropdown
	 */
	private _populateCondition(): void {
		if (this.s.conditions.length === 0) {
			let column = $(this.dom.field).children('option:selected').val();
			this.s.type = this.s.dt.columns().type().toArray()[column];

			if (this.c.conditions[this.s.type] !== undefined) {
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
		else {
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
	}

	/**
	 * Populates the field select element
	 */
	private _populateField(): void {
		if (this.s.fields.length === 0) {
			this.s.dt.columns().every((index) => {
				let found = false;

				for (let val of this.s.fields) {
					if (val.index === index) {
						found = true;
						break;
					}
				}

				if (!found) {
					let opt = {text: this.s.dt.settings()[0].aoColumns[index].sTitle, index};
					this.s.fields.push(opt);
					$(this.dom.field).append(
						$('<option>', {
							text : opt.text,
							value : opt.index
						})
						.addClass(this.classes.option)
					);
				}
			});
		}
		else {
			for (let field of this.s.fields) {
				let newOpt = $('<option>', {
					text : field.text,
					value : field.index
				})
				.addClass(this.classes.option);

				if (+this.s.field === field.index) {
					$(newOpt).attr('selected', true);
				}

				$(this.dom.field).append(newOpt);
			}
		}
	}

	/**
	 * Populates the Value select element
	 */
	private _populateValue(): void {
		let conditionType = 'select';
		let valCount = 1;
		let joinerText;
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

		if (conditionType === 'select') {
			// If there are input fields then remove them and add the select field
			if ($(this.dom.container).has(this.dom.valueInputs[0]).length !== 0) {
				$(this.dom.value).insertBefore(this.dom.valueInputs[0]);
				$('.' + this.classes.joiner).remove();

				for (let input of this.dom.valueInputs) {
					$(input).remove();
				}

				this.setListeners();
			}

			if (this.s.values.length === 0) {
				let column = $(this.dom.field).children('option:selected').val();
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
		else if (
			(conditionType === 'input' || conditionType === 'date') &&
			$(this.dom.container).has(this.dom.value).length !== 0
		) {
			$(this.dom.valueInputs[0]).insertBefore(this.dom.value);
			$(this.dom.valueInputs[0]).val(this.s.value[0]);

			if (conditionType === 'date') {
				// let $input = $(this.dom.valueInputs[0]) as any;
				// $input.dtDateTime();
				// new DateTime(this.dom.valueInputs[0], undefined);
				$(this.dom.valueInputs[0]).dtDateTime();
			}

			for (let i = 1; i < valCount && i < this.dom.valueInputs.length; i++) {
				$('<span>').addClass(this.classes.joiner).text(joinerText).insertBefore(this.dom.value);
				$(this.dom.valueInputs[i]).insertBefore(this.dom.value);
				$(this.dom.valueInputs[i]).val(this.s.value[i]);
				if (conditionType === 'date') {
					// let $input = $(this.dom.valueInputs[i]) as any;
					// $input.dtDateTime();
					$(this.dom.valueInputs[i]).dtDateTime();
				}
			}

			$(this.dom.value).remove();
			this.setListeners();
		}
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
}
