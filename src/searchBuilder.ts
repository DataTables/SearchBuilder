let $: any;
let DataTable: any;

/**
 * Sets the value of jQuery for use in the file
 * @param jq the instance of jQuery to be set
 */
export function setJQuery(jq: any): void {
	$ = jq;
	DataTable = jq.fn.DataTable;
}

import Criteria, * as criteriaType from './criteria';
import Group, * as groupType from './group';

export interface IDetails {
	criteria: Group[];
	logic: string;
}

export interface IClasses {
	button: string;
	clearAll: string;
	container: string;
	inputButton: string;
	title: string;
	titleRow: string;
}

export interface IDefaults {
	filterChanged: (count: number, text: string) => void;
	preDefined: boolean | IDetails;
	depthLimit: boolean | number;
	greyscale: boolean;
	logic: string;
	columns: number[] | boolean;
	conditions: {[keys: string]: {[keys: string]: criteriaType.ICondition}};
	i18n: II18n;
	orthogonal: criteriaType.IOrthogonal;
}

export interface IDom {
	clearAll: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	title: JQuery<HTMLElement>;
	titleRow: JQuery<HTMLElement>;
	topGroup: JQuery<HTMLElement>;
}

export interface II18n {
	add: string;
	button: {
		0: string;
		_: string;
	};
	clearAll: string;
	condition: string;
	conditions?: {
		[s: string]: {
			[t: string]: string
		}
	};
	data: string;
	deleteTitle: string;
	leftTitle: string;
	logicAnd: string;
	logicOr: string;
	rightTitle: string;
	title: {
		0: string;
		_: string;
	};
	value: string;
}

export interface IS {
	dt: any;
	opts: IDefaults;
	search: (settings: any, searchData: any, dataIndex: any, origData: any) => boolean;
	topGroup: Group;
}

/**
 * SearchBuilder class for DataTables.
 * Allows for complex search queries to be constructed and implemented on a DataTable
 */
export default class SearchBuilder {
	private static version = '1.0.0';

	private static classes: IClasses = {
		button: 'dtsb-button',
		clearAll: 'dtsb-clearAll',
		container: 'dtsb-searchBuilder',
		inputButton: 'dtsb-iptbtn',
		title: 'dtsb-title',
		titleRow: 'dtsb-titleRow'
	};

	private static defaults: IDefaults = {
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
			conditions: {
				date: {
					after: 'After',
					before: 'Before',
					between: 'Between',
					empty: 'Empty',
					equals: 'Equals',
					not: 'Not',
					notBetween: 'Not Between',
					notEmpty: 'Not Empty',
				},
				moment: {
					after: 'After',
					before: 'Before',
					between: 'Between',
					empty: 'Empty',
					equals: 'Equals',
					not: 'Not',
					notBetween: 'Not Between',
					notEmpty: 'Not Empty',
				},
				number: {
					between: 'Between',
					empty: 'Empty',
					equals: 'Equals',
					gt: 'Greater Than',
					gte: 'Greater Than Equal To',
					lt: 'Less Than',
					lte: 'Less Than Equal To',
					not: 'Not',
					notBetween: 'Not Between',
					notEmpty: 'Not Empty',
				},
				string: {
					contains: 'Contains',
					empty: 'Empty',
					endsWith: 'Ends With',
					equals: 'Equals',
					not: 'Not',
					notEmpty: 'Not Empty',
					startsWith: 'Starts With',
				}
			},
			data: 'Data',
			deleteTitle: 'Delete filtering rule',
			leftTitle: 'Outdent criteria',
			logicAnd: 'And',
			logicOr: 'Or',
			rightTitle: 'Indent criteria',
			title: {
				0: 'Custom Search Builder',
				_: 'Custom Search Builder (%d)',
			},
			value: 'Value',
		},
		logic: 'AND',
		orthogonal: {
			conditionName: 'Condition Name',
			search: 'filter',
		},
		preDefined: false,
	};

	public classes: IClasses;
	public dom: IDom;
	public c: IDefaults;
	public s: IS;

	constructor(builderSettings: any, opts: IDefaults) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
			throw new Error('SearchBuilder requires DataTables 1.10 or newer');
		}

		let table = new DataTable.Api(builderSettings);
		this.classes = $.extend(true, {}, SearchBuilder.classes);

		// Get options from user
		this.c = $.extend(true, {}, SearchBuilder.defaults, opts);

		this.dom = {
			clearAll: $('<button type="button">' + table.i18n('searchBuilder.clearAll', this.c.i18n.clearAll) + '</button>')
				.addClass(this.classes.clearAll)
				.addClass(this.classes.button),
			container: $('<div/>')
				.addClass(this.classes.container),
			title: $('<div/>')
				.addClass(this.classes.title),
			titleRow: $('<div/>')
				.addClass(this.classes.titleRow),
			topGroup: undefined
		};

		this.s = {
			dt: table,
			opts,
			search: undefined,
			topGroup: undefined
		};

		// If searchbuilder is already defined for this table then return
		if (table.settings()[0]._searchBuilder !== undefined) {
			return;
		}

		table.settings()[0]._searchBuilder = this;

		// Run the remaining setup when the table is initialised
		if (this.s.dt.settings()[0]._bInitComplete) {
			this._setUp();
		}
		else {
			table.one('init.dt', () => {
				this._setUp();
			});
		}

		return this;
	}
	
	/**
	 * Gets the details required to rebuild the SearchBuilder as it currently is, but formatted as a string
	 */
	public getDetailsString(): string {		
	    var output = '';
		
	    var builderDetails = getDetails();

	    if (builderDetails.criteria) {
		output += '( ';

		var logicalOperator = ' ' +  builderDetails.logic + ' ';

		for (let logicalUnit of builderDetails.criteria) {
		    output += formatSearchBuilderDetails(logicalUnit);
		    output += logicalOperator;
		});

		if (output.endsWith(logicalOperator)) {
		    output = output.substring(0, output.length - logicalOperator.length)
		}

		output += ' )';
	    }
	    else {
		output += builderDetails.data + ' ' + builderDetails.condition + ' ';

		var andOperator = ' AND ';

		for (let item of builderDetails.value) {
		    output += item + andOperator;
		});

		if (output.endsWith(andOperator)) {
		    output = output.substring(0, output.length - andOperator.length)
		}
	    }

	    return output;
	}

	/**
	 * Gets the details required to rebuild the SearchBuilder as it currently is
	 */
	public getDetails(): IDetails | object {
		return this.s.topGroup.getDetails();
	}

	/**
	 * Getter for the node of the container for the searchBuilder
	 * @returns JQuery<HTMLElement> the node of the container
	 */
	public getNode(): JQuery < HTMLElement > {
		return this.dom.container;
	}

	/**
	 * Rebuilds the SearchBuilder to a state that is provided
	 * @param details The details required to perform a rebuild
	 */
	public rebuild(details): SearchBuilder {
		$(this.dom.clearAll).click();

		// If there are no details to rebuild then return
		if (details === undefined || details === null) {
			return this;
		}

		this.s.topGroup.rebuild(details);
		this.s.dt.draw();
		this.s.topGroup.setListeners();

		return this;
	}

	/**
	 * Applies the defaults to preDefined criteria
	 * @param preDef the array of criteria to be processed.
	 */
	private _applyPreDefDefaults(preDef) {
		if (preDef.criteria !== undefined && preDef.logic === undefined) {
			preDef.logic = 'AND';
		}

		for (let crit of preDef.criteria) {
			// Apply the defaults to any further criteria
			if (crit.criteria !== undefined) {
				crit = this._applyPreDefDefaults(crit);
			}
			else {
				this.s.dt.columns().every((index) => {
					if (this.s.dt.settings()[0].aoColumns[index].sTitle === crit.data) {
						crit.dataIdx = index;
					}
				});
			}
		}

		return preDef;
	}

	/**
	 * Set's up the SearchBuilder
	 */
	private _setUp(loadState = true): void {
		this.s.topGroup = new Group(this.s.dt, this.c, undefined);

		this._setClearListener();

		this.s.dt.on('stateSaveParams', (e, settings, data) => {
			data.searchBuilder = this.getDetails();
			data.page = this.s.dt.page();
		});

		this._build();

		if (loadState) {
			let loadedState = this.s.dt.state.loaded();

			// If the loaded State is not null rebuild based on it for statesave
			if (loadedState !== null && loadedState.searchBuilder !== undefined) {
				this.s.topGroup.rebuild(loadedState.searchBuilder);
				$(this.s.topGroup.dom.container).trigger('dtsb-redrawContents');
				this.s.dt.page(loadedState.page).draw('page');
				this.s.topGroup.setListeners();
			}
			// Otherwise load any predefined options
			else if (this.c.preDefined !== false) {
				this.c.preDefined = this._applyPreDefDefaults(this.c.preDefined);
				this.rebuild(this.c.preDefined);
			}
		}

		this._setEmptyListener();
		this.s.dt.state.save();
	}

	/**
	 * Updates the title of the SearchBuilder
	 * @param count the number of filters in the SearchBuilder
	 */
	private _updateTitle(count) {
		$(this.dom.title).text(
			this.s.dt.i18n('searchBuilder.title', this.c.i18n.title, count)
		);
	}

	/**
	 * Builds all of the dom elements together
	 */
	private _build(): void {
		// Empty and setup the container
		$(this.dom.clearAll).remove();
		$(this.dom.container).empty();
		let count = this.s.topGroup.count();
		this._updateTitle(count);
		$(this.dom.titleRow).append(this.dom.title);
		$(this.dom.container).append(this.dom.titleRow);
		this.dom.topGroup = this.s.topGroup.getNode();
		$(this.dom.container).append(this.dom.topGroup);
		this._setRedrawListener();
		let tableNode: Node = this.s.dt.table(0).node();

		if ($.fn.dataTable.ext.search.indexOf(this.s.search) === -1) {
			// Custom search function for SearchBuilder
			this.s.search = (settings, searchData, dataIndex, origData) => {
				if (settings.nTable !== tableNode) {
					return true;
				}

				return this.s.topGroup.search(searchData);
			};

			// Add SearchBuilder search function to the dataTables search array
			$.fn.dataTable.ext.search.push(this.s.search);
		}

		// Register an Api method for getting the column type
		$.fn.DataTable.Api.registerPlural('columns().type()', 'column().type()', function(selector, opts) {
			return this.iterator('column', function(settings, column) {
				return settings.aoColumns[column].sType;
			}, 1);
		});

		this.s.dt.on('destroy.dt', () => {
			$(this.dom.container).remove();
			$(this.dom.clearAll).remove();

			let searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.search);

			while (searchIdx !== -1) {
				$.fn.dataTable.ext.search.splice(searchIdx, 1);
				searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.search);
			}
		});
	}

	/**
	 * Checks if the clearAll button should be added or not
	 */
	private _checkClear() {
		if (this.s.topGroup.s.criteria.length > 0) {
			$(this.dom.clearAll).insertAfter(this.dom.title);
			this._setClearListener();
		}
		else {
			$(this.dom.clearAll).remove();
		}
	}

	/**
	 * Update the count in the title/button
	 * @param count Number of filters applied
	 */
	private _filterChanged(count: number): void {
		let fn = this.c.filterChanged;

		if (typeof fn === 'function') {
			fn(count, this.s.dt.i18n('searchBuilder.button', this.c.i18n.button, count));
		}
	}

	/**
	 * Set the listener for the clear button
	 */
	private _setClearListener() {
		$(this.dom.clearAll).unbind('click');
		$(this.dom.clearAll).on('click', () => {
			this.s.topGroup = new Group(this.s.dt, this.c, undefined);
			this._build();
			this.s.dt.draw();
			this.s.topGroup.setListeners();
			$(this.dom.clearAll).remove();
			this._setEmptyListener();
			this._filterChanged(0);

			return false;
		});
	}

	/**
	 * Set the listener for the Redraw event
	 */
	private _setRedrawListener() {
		$(this.s.topGroup.dom.container).unbind('dtsb-redrawContents');
		$(this.s.topGroup.dom.container).on('dtsb-redrawContents', () => {
			this._checkClear();
			this.s.topGroup.redrawContents();
			this.s.topGroup.setupLogic();
			this._setEmptyListener();

			let count = this.s.topGroup.count();

			this._updateTitle(count);
			this._filterChanged(count);

			this.s.dt.state.save();
		});

		$(this.s.topGroup.dom.container).unbind('dtsb-clearContents');
		$(this.s.topGroup.dom.container).on('dtsb-clearContents', () => {
			this._setUp(false);
			this._filterChanged(0);

			this.s.dt.draw();
		});

		$(this.s.topGroup.dom.container).on('dtsb-updateTitle', () => {
			let count = this.s.topGroup.count();
			this._updateTitle(count);
			this._filterChanged(count);
		});
	}

	/**
	 * Sets listeners to check whether clearAll should be added or removed
	 */
	private _setEmptyListener() {
		$(this.s.topGroup.dom.add).on('click', () => {
			this._checkClear();
		});

		$(this.s.topGroup.dom.container).on('dtsb-destroy', () => {
			$(this.dom.clearAll).remove();
		});
	}
}
