let $;
let DataTable;

export function setJQuery(jq) {
  $ = jq;
  DataTable = jq.fn.dataTable;
};

export default class Criteria {
	private static version = '0.0.1';

	private static classes = {
		container: 'dtsb-criteria',
		field: 'dtsb-field',
		dropDown: 'dtsb-dropDown',
		input: 'dtsb-input',
		roundButton: 'dtsb-rndbtn',
		delete: 'dtsb-delete',
		right: 'dtsb-right',
		left: 'dtsb-left'
	}

	private static defaults = {
		conditions: {
			string: [
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
			],
			num: [
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
						return +value >= +comparison[0]
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
					type: 'input',
					valueInputs: 2
				},
				{
					display: 'Between Inclusive',
					comparator(value, comparison) {
						return +comparison[0] <= +value && +value <= +comparison[1];
					},
					type: 'input',
					valueInputs: 2
				},
			]
		},
		orthogonal: {
			display: 'display',
			hideCount: false,
			search: 'filter',
			show: undefined,
			sort: 'sort',
			threshold: 0.6,
			type: 'type'
		}
	}

	public classes;
	public dom;
	public c;
	public s;

	constructor(opts, table, index = 0) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
			throw new Error('SearchPane requires DataTables 1.10 or newer');
		}

		this.classes = $.extend(true, {}, Criteria.classes);

		// Get options from user
		this.c = $.extend(true, {}, Criteria.defaults, opts);

		this.s = {
			dt: table,
			index,
			fields: [],
			filled: false,
			conditions: [],
			values: []
		}

		this.dom = {
			container: $('<div/>').addClass(this.classes.container),
			field: $('<select/>').addClass(this.classes.field).addClass(this.classes.dropDown),
			fieldTitle: $('<option value="" disabled selected hidden/>').text('Field'),
			condition: $('<select/>').addClass(this.classes.condition).addClass(this.classes.dropDown).addClass(this.classes.disabled),
			conditionTitle: $('<option value="" disabled selected hidden/>').text('Condition'),
			value: $('<select/>').addClass(this.classes.value).addClass(this.classes.dropDown).addClass(this.classes.disabled),
			valueInputs: [
				$('<input/>').addClass(this.classes.value).addClass(this.classes.input).addClass(this.classes.disabled),
				$('<input/>').addClass(this.classes.value).addClass(this.classes.input).addClass(this.classes.disabled)
			],
			valueTitle: $('<option value="" disabled selected hidden/>').text('Value'),
			left: $('<button>&#x2190;</button>').addClass(this.classes.left).addClass(this.classes.roundButton),
			right: $('<button disabled>&#x2192;</button>').addClass(this.classes.right).addClass(this.classes.roundButton),
			delete: $('<button>x</button>').addClass(this.classes.delete).addClass(this.classes.roundButton),
		}

		this._buildCriteria();
	}

	/**
	 * Adds the left button to the criteria
	 */
	public addLeft(): void {
		$(this.dom.container).empty();

		// Get the type of condition and the number of values required so we now how many value inputs to append
		let conditionType;
		let valCount;

		for (let opt of this.s.conditions) {
			if (opt.display === this.s.condition) {
				conditionType = opt.type;
				valCount = opt.valueInputs;
				break;
			}
		}

		// If it is a select condition then just append the select
		if (conditionType === 'select') {
			$(this.dom.container).append(this.dom.field).append(this.dom.condition).append(this.dom.value).append(this.dom.delete).append(this.dom.right).append(this.dom.left);
		}
		// If it is an input condition then append everything in order and all of the input elements required
		else if (conditionType === 'input') {
			$(this.dom.container).append(this.dom.field).append(this.dom.condition);

			for (let i = 0; i < valCount && i < this.dom.valueInputs.length; i++) {
				$(this.dom.container.append(this.dom.valueInputs[i]));
			}

			$(this.dom.container).append(this.dom.delete).append(this.dom.right).append(this.dom.left);
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
	 * Removes the node for the left button
	 */
	public removeLeft(): void {
		$(this.dom.container).empty();
		$(this.dom.container).append(this.dom.field).append(this.dom.condition).append(this.dom.value).append(this.dom.delete).append(this.dom.right);
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
		})

		for (let i = 0; i < this.dom.valueInputs.length; i++) {
			$(this.dom.valueInputs[i]).unbind('input');
			$(this.dom.valueInputs[i]).on('input', () => {
				this.s.value[i] = $(this.dom.valueInputs[i]).val();
				let allFilled = true;

				// Check that all of the value inputs have been filled in
				for (let val = 0; val < this.dom.valueInputs.length; val++) {
					if (this.s.value[val] !== undefined && this.s.value[val].length === 0) {
						allFilled = false;
						break;
					}
				}

				this.s.filled = allFilled;
				this.s.dt.draw();
			})
		}

		$(this.dom.delete).unbind('change');
		$(this.dom.delete).on('click', () => {
			this.destroy();
			this.s.dt.draw();
		})
	}

	/**
	 * Builds the elements of the dom together
	 */
	private _buildCriteria(): void {
		$(this.dom.field).append(this.dom.fieldTitle);
		$(this.dom.condition).append(this.dom.conditionTitle);
		$(this.dom.value).append(this.dom.valueTitle);
		$(this.dom.container).append(this.dom.field).append(this.dom.condition).append(this.dom.value).append(this.dom.delete).append(this.dom.right);

		this.setListeners();
	}

	/**
	 * Clears the condition select element
	 */
	private _clearCondition(): void {
		$(this.dom.condition).empty()
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
			let type = this.s.dt.columns().type().toArray()[column];

			if (this.c.conditions[type] !== undefined) {
				for (let condition of this.c.conditions[type]) {
					this.s.conditions.push(condition)
					$(this.dom.condition).append($('<option>', {
						text : condition.display,
						value : condition.display,
					}))
				}
			}
		}
		else {
			for (let condition of this.s.conditions) {
				let newOpt = $('<option>', {
					text : condition.display,
					value : condition.display
				});

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
					$(this.dom.field).append($('<option>', {
						text : opt.text,
						value : opt.index
					}));
				}
			});
		}
		else {
			for (let field of this.s.fields) {
				let newOpt = $('<option>', {
					text : field.text,
					value : field.index
				});

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
		this.s.filled = false;

		// Find the condition type and the number of value inputs required
		for (let opt of this.s.conditions) {
			if (opt.display === this.s.condition) {
				conditionType = opt.type;
				valCount = opt.valueInputs;
				break;
			}
		}

		if (conditionType === 'select') {
			// If there are input fields then remove them and add the select field
			if ($(this.dom.container).has(this.dom.valueInputs[0]).length !== 0) {
				$(this.dom.value).insertBefore(this.dom.valueInputs[0]);

				for (let input of this.dom.valueInputs) {
					$(input).remove();
				}

				this.setListeners();
			}

			if (this.s.values.length === 0) {
				let column = $(this.dom.field).children('option:selected').val();
				let indexArray = this.s.dt.rows().indexes();
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
						let val = {filter, text: settings.oApi._fnGetCellData(settings, index, column, this.c.orthogonal.display), index}
						this.s.values.push(val);
						$(this.dom.value).append($('<option>', {
							text : val.text,
							value : val.filter
						}));
					}
				}
			}
			else {
				for (let val of this.s.values) {
					let newOpt = $('<option>', {
						text : val.text,
						value : val.filter
					});

					if (this.s.value[0] === val.filter) {
						$(newOpt).attr('selected', true);
						this.s.filled = true;
					}

					$(this.dom.value).append(newOpt);
				}
			}
		}
		else if (conditionType === 'input' && $(this.dom.container).has(this.dom.value).length !== 0) {
			for (let i = 0; i < valCount && i < this.dom.valueInputs.length; i++) {
				$(this.dom.valueInputs[i]).insertBefore(this.dom.value);
				$(this.dom.valueInputs[i]).val(this.s.value[i])
			}
			$(this.dom.value).remove();
			this.setListeners();
		}
	}
}
