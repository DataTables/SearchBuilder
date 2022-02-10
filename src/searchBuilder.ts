let $: any;
let dataTable: any;

/**
 * Sets the value of jQuery for use in the file
 *
 * @param jq the instance of jQuery to be set
 */
export function setJQuery(jq: any): void {
	$ = jq;
	dataTable = jq.fn.DataTable;
}

import Criteria, * as criteriaType from './criteria';
import Group from './group';

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
	columns: number[] | boolean;
	conditions: {[keys: string]: {[keys: string]: criteriaType.ICondition}};
	depthLimit: boolean | number;
	enterSearch: boolean;
	filterChanged: (count: number, text: string) => void;
	greyscale: boolean;
	i18n: II18n;
	logic: string;
	orthogonal: criteriaType.IOrthogonal;
	preDefined: boolean | IDetails;
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
			[t: string]: string;
		};
	};
	data: string;
	delete: string;
	deleteTitle: string;
	left: string;
	leftTitle: string;
	logicAnd: string;
	logicOr: string;
	right: string;
	rightTitle: string;
	title: {
		0: string;
		_: string;
	};
	value: string;
	valueJoiner: string;
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
	private static version = '1.3.1';

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
			conditions: {
				array: {
					contains: 'Contains',
					empty: 'Empty',
					equals: 'Equals',
					not: 'Not',
					notEmpty: 'Not Empty',
					without: 'Without'
				},
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
				// eslint-disable-next-line id-blacklist
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
				// eslint-disable-next-line id-blacklist
				string: {
					contains: 'Contains',
					empty: 'Empty',
					endsWith: 'Ends With',
					equals: 'Equals',
					not: 'Not',
					notContains: 'Does Not Contain',
					notEmpty: 'Not Empty',
					notEndsWith: 'Does Not End With',
					notStartsWith: 'Does Not Start With',
					startsWith: 'Starts With',
				}
			},
			data: 'Data',
			delete: '&times',
			deleteTitle: 'Delete filtering rule',
			left: '<',
			leftTitle: 'Outdent criteria',
			logicAnd: 'And',
			logicOr: 'Or',
			right: '>',
			rightTitle: 'Indent criteria',
			title: {
				0: 'Custom Search Builder',
				_: 'Custom Search Builder (%d)',
			},
			value: 'Value',
			valueJoiner: 'and'
		},
		logic: 'AND',
		orthogonal: {
			display: 'display',
			search: 'filter',
		},
		preDefined: false,
	};

	public classes: IClasses;
	public dom: IDom;
	public c: IDefaults;
	public s: IS;

	public constructor(builderSettings: any, opts: IDefaults) {
		// Check that the required version of DataTables is included
		if (! dataTable || ! dataTable.versionCheck || ! dataTable.versionCheck('1.10.0')) {
			throw new Error('SearchBuilder requires DataTables 1.10 or newer');
		}

		let table = new dataTable.Api(builderSettings);
		this.classes = $.extend(true, {}, SearchBuilder.classes);

		// Get options from user
		this.c = $.extend(true, {}, SearchBuilder.defaults, opts);

		this.dom = {
			clearAll: $(
				'<button type="button">' + table.i18n('searchBuilder.clearAll', this.c.i18n.clearAll) + '</button>'
			)
				.addClass(this.classes.clearAll)
				.addClass(this.classes.button)
				.attr('type', 'button'),
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

		// If using SSP we want to include the previous state in the very first server call
		if(this.s.dt.page.info().serverSide) {
			this.s.dt.on('preXhr.dtsb', (e, settings, data) => {
				let loadedState = this.s.dt.state.loaded();
				if (loadedState && loadedState.searchBuilder) {
					data.searchBuilder = this._collapseArray(loadedState.searchBuilder);
				}
			});
		}

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
	 * Gets the details required to rebuild the SearchBuilder as it currently is
	 */
	// eslint upset at empty object but that is what it is
	// eslint-disable-next-line @typescript-eslint/ban-types
	public getDetails(deFormatDates=false): IDetails | {} {
		return this.s.topGroup.getDetails(deFormatDates);
	}

	/**
	 * Getter for the node of the container for the searchBuilder
	 *
	 * @returns JQuery<HTMLElement> the node of the container
	 */
	public getNode(): JQuery < HTMLElement > {
		return this.dom.container;
	}

	/**
	 * Rebuilds the SearchBuilder to a state that is provided
	 *
	 * @param details The details required to perform a rebuild
	 */
	public rebuild(details): SearchBuilder {
		this.dom.clearAll.click();

		// If there are no details to rebuild then return
		if (details === undefined || details === null) {
			return this;
		}

		this.s.topGroup.s.preventRedraw = true;
		this.s.topGroup.rebuild(details);
		this.s.topGroup.s.preventRedraw = false;

		this._checkClear();
		this._updateTitle(this.s.topGroup.count());
		this.s.topGroup.redrawContents();

		this.s.dt.draw(false);
		this.s.topGroup.setListeners();

		return this;
	}

	/**
	 * Applies the defaults to preDefined criteria
	 *
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
		// Register an Api method for getting the column type
		$.fn.DataTable.Api.registerPlural('columns().type()', 'column().type()', function() {
			return this.iterator('column', function(settings, column) {
				return settings.aoColumns[column].sType;
			}, 1);
		});

		// Check that DateTime is included, If not need to check if it could be used
		// eslint-disable-next-line no-extra-parens
		if (!(dataTable as any).DateTime) {
			let types = this.s.dt.columns().type().toArray();

			if (types === undefined || types.includes(undefined) || types.includes(null)) {
				types = [];
				for (let colInit of this.s.dt.settings()[0].aoColumns) {
					types.push(colInit.searchBuilderType !== undefined ? colInit.searchBuilderType : colInit.sType);
				}
			}

			let columnIdxs = this.s.dt.columns().toArray();

			// If the types are not yet set then draw to see if they can be retrieved then
			if(types === undefined || types.includes(undefined) || types.includes(null)) {
				$.fn.dataTable.ext.oApi._fnColumnTypes(this.s.dt.settings()[0]);
				types = this.s.dt.columns().type().toArray();
			}

			for(let i = 0; i < columnIdxs[0].length; i++) {
				let column = columnIdxs[0][i];
				let type = types[column];

				if(
					// Check if this column can be filtered
					(
						this.c.columns === true ||
						Array.isArray(this.c.columns) &&
						this.c.columns.includes(i)
					) &&
					// Check if the type is one of the restricted types
					(
						type.includes('date') ||
						type.includes('moment') ||
						type.includes('luxon')
					)
				) {
					alert('SearchBuilder Requires DateTime when used with dates.');
					throw new Error('SearchBuilder requires DateTime');
				}
			}
		}

		this.s.topGroup = new Group(this.s.dt, this.c, undefined);

		this._setClearListener();

		this.s.dt.on('stateSaveParams.dtsb', (e, settings, data) => {
			data.searchBuilder = this.getDetails();
			data.page = this.s.dt.page();
		});

		this.s.dt.on('stateLoadParams.dtsb', (e, settings, data) => {
			this.rebuild(data.searchBuilder);
		});

		this._build();

		this.s.dt.on('preXhr.dtsb', (e, settings, data) => {
			if (this.s.dt.page.info().serverSide) {
				data.searchBuilder = this._collapseArray(this.getDetails(true));
			}
		});

		this.s.dt.on('column-reorder', () => {
			this.rebuild(this.getDetails());
		});

		if (loadState) {
			let loadedState = this.s.dt.state.loaded();

			// If the loaded State is not null rebuild based on it for statesave
			if (loadedState !== null && loadedState.searchBuilder !== undefined) {
				this.s.topGroup.rebuild(loadedState.searchBuilder);
				this.s.topGroup.dom.container.trigger('dtsb-redrawContents');

				// If using SSP we want to restrict the amount of server calls that take place
				//  and this information will already have been processed
				if (!this.s.dt.page.info().serverSide) {
					this.s.dt.page(loadedState.page).draw('page');
				}

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

	private _collapseArray(criteria) {
		if(criteria.logic === undefined) {
			if (criteria.value !== undefined) {
				criteria.value.sort((a,b)=> {
					if(!isNaN(+a)) {
						a = +a;
						b = +b;
					}
					if(a<b) {
						return -1;
					}
					else if(b<a) {
						return 1;
					}
					else {
						return 0;
					}
				});
				criteria.value1 = criteria.value[0];
				criteria.value2 = criteria.value[1];
			}
		}
		else {
			for(let i = 0; i < criteria.criteria.length; i++) {
				criteria.criteria[i] = this._collapseArray(criteria.criteria[i]);
			}
		}
		return criteria;
	}

	/**
	 * Updates the title of the SearchBuilder
	 *
	 * @param count the number of filters in the SearchBuilder
	 */
	private _updateTitle(count) {
		this.dom.title.html(
			this.s.dt.i18n('searchBuilder.title', this.c.i18n.title, count)
		);
	}

	/**
	 * Builds all of the dom elements together
	 */
	private _build(): void {
		// Empty and setup the container
		this.dom.clearAll.remove();
		this.dom.container.empty();
		let count = this.s.topGroup.count();
		this._updateTitle(count);
		this.dom.titleRow.append(this.dom.title);
		this.dom.container.append(this.dom.titleRow);
		this.dom.topGroup = this.s.topGroup.getNode();
		this.dom.container.append(this.dom.topGroup);
		this._setRedrawListener();
		let tableNode: Node = this.s.dt.table(0).node();

		if (!$.fn.dataTable.ext.search.includes(this.s.search)) {
			// Custom search function for SearchBuilder
			this.s.search = (settings, searchData, dataIndex) => {
				if (settings.nTable !== tableNode) {
					return true;
				}

				return this.s.topGroup.search(searchData, dataIndex);
			};

			// Add SearchBuilder search function to the dataTables search array
			$.fn.dataTable.ext.search.push(this.s.search);
		}

		this.s.dt.on('destroy.dtsb', () => {
			this.dom.container.remove();
			this.dom.clearAll.remove();

			let searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.search);

			while (searchIdx !== -1) {
				$.fn.dataTable.ext.search.splice(searchIdx, 1);
				searchIdx = $.fn.dataTable.ext.search.indexOf(this.s.search);
			}

			this.s.dt.off('.dtsb');
			$(this.s.dt.table().node()).off('.dtsb');
		});
	}

	/**
	 * Checks if the clearAll button should be added or not
	 */
	private _checkClear() {
		if (this.s.topGroup.s.criteria.length > 0) {
			this.dom.clearAll.insertAfter(this.dom.title);
			this._setClearListener();
		}
		else {
			this.dom.clearAll.remove();
		}
	}

	/**
	 * Update the count in the title/button
	 *
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
		this.dom.clearAll.unbind('click');
		this.dom.clearAll.on('click.dtsb', () => {
			this.s.topGroup = new Group(this.s.dt, this.c, undefined);
			this._build();
			this.s.dt.draw();
			this.s.topGroup.setListeners();
			this.dom.clearAll.remove();
			this._setEmptyListener();
			this._filterChanged(0);

			return false;
		});
	}

	/**
	 * Set the listener for the Redraw event
	 */
	private _setRedrawListener() {
		this.s.topGroup.dom.container.unbind('dtsb-redrawContents');
		this.s.topGroup.dom.container.on('dtsb-redrawContents.dtsb', () => {
			this._checkClear();
			this.s.topGroup.redrawContents();
			this.s.topGroup.setupLogic();
			this._setEmptyListener();

			let count = this.s.topGroup.count();

			this._updateTitle(count);
			this._filterChanged(count);

			// If using SSP we want to restrict the amount of server calls that take place
			//  and this information will already have been processed
			if (!this.s.dt.page.info().serverSide) {
				this.s.dt.draw();
			}

			this.s.dt.state.save();
		});

		this.s.topGroup.dom.container.unbind('dtsb-redrawContents-noDraw');
		this.s.topGroup.dom.container.on('dtsb-redrawContents-noDraw.dtsb', () => {
			this._checkClear();
			this.s.topGroup.s.preventRedraw = true;
			this.s.topGroup.redrawContents();
			this.s.topGroup.s.preventRedraw = false;
			this.s.topGroup.setupLogic();
			this._setEmptyListener();

			let count = this.s.topGroup.count();

			this._updateTitle(count);
			this._filterChanged(count);
		});

		this.s.topGroup.dom.container.unbind('dtsb-redrawLogic');
		this.s.topGroup.dom.container.on('dtsb-redrawLogic.dtsb', () => {
			this.s.topGroup.redrawLogic();
			let count = this.s.topGroup.count();

			this._updateTitle(count);
			this._filterChanged(count);
		});

		this.s.topGroup.dom.container.unbind('dtsb-add');
		this.s.topGroup.dom.container.on('dtsb-add.dtsb', () => {
			let count = this.s.topGroup.count();

			this._updateTitle(count);
			this._filterChanged(count);
		});

		this.s.dt.on('postEdit.dtsb postCreate.dtsb postRemove.dtsb', () => {
			this.s.topGroup.redrawContents();
		});

		this.s.topGroup.dom.container.unbind('dtsb-clearContents');
		this.s.topGroup.dom.container.on('dtsb-clearContents.dtsb', () => {
			this._setUp(false);
			this._filterChanged(0);

			this.s.dt.draw();
		});
	}

	/**
	 * Sets listeners to check whether clearAll should be added or removed
	 */
	private _setEmptyListener() {
		this.s.topGroup.dom.add.on('click.dtsb', () => {
			this._checkClear();
		});

		this.s.topGroup.dom.container.on('dtsb-destroy.dtsb', () => {
			this.dom.clearAll.remove();
		});
	}
}
