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
						return value === comparison;
					}
				},
				{
					display: 'Starts With',
					comparator(value, comparison) {
						return comparison.indexOf(value) === 0;
					}
				},
				{
					display: 'Ends with',
					comparator(value, comparison) {
						return comparison.indexOf(value) === comparison.length - value.length;
					}
				},
				{
					display: 'Contains',
					comparator(value, comparison) {
						return comparison.indexOf(value) !== -1;
					}
				},
				{
					display: 'After',
					comparator(value, comparison) {
						return value < comparison;
					}
				},
				{
					display: 'Before',
					comparator(value, comparison) {
						return value > comparison;
					}
				},
				{
					display: 'Not',
					comparator(value, comparison) {
						return value !== comparison;
					}
				},
			],
			number: [
				{
					display: 'Equals',
					comparator(value, comparison) {
						return value === comparison;
					}
				},
				{
					display: 'Greater Than',
					comparator(value, comparison) {
						return comparison > value;
					}
				},
				{
					display: 'Less Than',
					comparator(value, comparison) {
						return comparison < value;
					}
				},
				{
					display: 'Greater Than Equal To',
					comparator(value, comparison) {
						return comparison >= value;
					}
				},
				{
					display: 'Less Than Equal To',
					comparator(value, comparison) {
						return comparison <= value;
					}
				},
				{
					display: 'Not',
					comparator(value, comparison) {
						return value !== comparison;
					}
				},
				{
					display: 'Between Exclusive',
					comparator(value1, value2, comparison) {
						return value1 < comparison < value2;
					}
				},
				{
					display: 'Between Inclusive',
					comparator(value1, value2, comparison) {
						return value1 <= comparison <= value2;
					}
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
			fields: {},
			conditions: {},
			values: {}
		}

		this.dom = {
			container: $('<div/>').addClass(this.classes.container),
			field: $('<select/>').addClass(this.classes.field).addClass(this.classes.dropDown),
			fieldTitle: $('<option value="" disabled selected hidden/>').text('Field'),
			condition: $('<select/>').addClass(this.classes.condition).addClass(this.classes.dropDown).addClass(this.classes.disabled),
			conditionTitle: $('<option value="" disabled selected hidden/>').text('Condition'),
			value: $('<select/>').addClass(this.classes.value).addClass(this.classes.dropDown).addClass(this.classes.disabled),
			valueTitle: $('<option value="" disabled selected hidden/>').text('Value'),
			left: $('<button>&#x2190;</button>').addClass(this.classes.left).addClass(this.classes.roundButton),
			right: $('<button disabled>&#x2192;</button>').addClass(this.classes.right).addClass(this.classes.roundButton),
			delete: $('<button>x</button>').addClass(this.classes.delete).addClass(this.classes.roundButton),
		}

		this.buildCriteria();

		this.populateField();
	}

	public exec(rowData) {
		$(this.dom.condition).children('option:selected').val().comparator(rowData[$(this.dom.field).children('option:selected').val().value])
	}

	public getNode() {
		return this.dom.container;
	}

	private buildCriteria() {
		$(this.dom.field).append(this.dom.fieldTitle);
		$(this.dom.condition).append(this.dom.conditionTitle);
		$(this.dom.value).append(this.dom.valueTitle);
		$(this.dom.container).append(this.dom.field).append(this.dom.condition).append(this.dom.value).append(this.dom.delete).append(this.dom.right);

		$(this.dom.field).on('change', () => {
			$(this.dom.fieldTitle).attr('selected', false);
			this.clearCondition();
			this.clearValue();
			this.populateCondition();
		});

		$(this.dom.condition).on('change', () => {
			$(this.dom.conditionTitle).attr('selected', false);
			this.clearValue();
			this.populateValue();
		});

		$(this.dom.value).on('change', () => {
			$(this.dom.valueTitle).attr('selected', false);
		})

		$(this.dom.delete).on('click', () => {
			this.destroy();
		})
	}

	public destroy() {
		$(this.dom.field).off('.dtsb');
		$(this.dom.condition).off('.dtsb');
		$(this.dom.value).off('.dtsb');
		$(this.dom.delete).off('.dtsb');

		$(this.dom.container).remove();
	}

	public addLeft() {
		$(this.dom.container).empty();
		$(this.dom.container).append(this.dom.field).append(this.dom.condition).append(this.dom.value).append(this.dom.delete).append(this.dom.right).append(this.dom.left);
	}

	private populateField() {
		this.s.dt.columns().every((index) => {
			if (!this.s.fields[index]) {
				this.s.fields[index] = this.s.dt.settings()[0].aoColumns[index].sTitle;
				$(this.dom.field).append($('<option>', {
					text : this.s.fields[index],
					value : index
				}));
			}
		});
	}

	private populateCondition() {
		let column = $(this.dom.field).children('option:selected').val();
		let type = typeof this.s.dt.column(column.value).data().toArray()[0];

		if (this.c.conditions[type] !== undefined) {
			for (let condition of this.c.conditions[type]) {
				$(this.dom.condition).append($('<option>', {
					text : condition.display,
					value : condition.display,
				}))
			}
		}
	}

	private clearCondition() {
		$(this.dom.condition).empty()
		$(this.dom.conditionTitle).attr('selected', true);
		$(this.dom.condition).append(this.dom.conditionTitle);
	}

	private populateValue() {
		let column = $(this.dom.field).children('option:selected').val();

		let indexArray = this.s.dt.rows().indexes();
		let settings = this.s.dt.settings()[0];

		for (let index of indexArray) {
			let filter = settings.oApi._fnGetCellData(settings, index, column, this.c.orthogonal.search);
			if (!this.s.values[filter]) {
				this.s.values[filter] = settings.oApi._fnGetCellData(settings, index, column, this.c.orthogonal.display);

				$(this.dom.value).append($('<option>', {
					text : this.s.values[filter],
					value : filter
				}));
			}
		}
	}

	private clearValue() {
		$(this.dom.value).empty()
		$(this.dom.valueTitle).attr('selected', true);
		$(this.dom.value).append(this.dom.valueTitle);
	}
}
