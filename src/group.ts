import Criteria, * as criteriaType from './criteria';
import * as builderType from './searchBuilder';

export interface IClassses {
	add: string;
	button: string;
	clearGroup: string;
	greyscale: string;
	group: string;
	inputButton: string;
	logic: string;
	logicContainer: string;
}

export interface IDom {
	add: JQuery<HTMLElement>;
	clear: JQuery<HTMLElement>;
	container: JQuery<HTMLElement>;
	logic: JQuery<HTMLElement>;
	logicContainer: JQuery<HTMLElement>;
}

export interface IS {
	criteria: ISCriteria[];
	depth: number;
	dt: any;
	index: number;
	isChild: boolean;
	logic: string;
	opts: builderType.IDefaults;
	toDrop: Criteria;
	topGroup: JQuery<HTMLElement>;
}

export interface ICriteria {
	criteria: Array<IDetails | criteriaType.IDetails>;
	index: number;
}

export interface ICriteriaDetails {
	condition?: string;
	data?: string;
	logic?: string;
	value?: string[];
}

export interface ISCriteria {
	criteria: Group | Criteria;
	index: number;
	logic?: string;
}

export interface IDetails {
	criteria?: ICriteriaDetails[];
	index?: number;
	logic?: string;
}

let $: any;
let dataTable: any;

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
 * The Group class is used within SearchBuilder to represent a group of criteria
 */
export default class Group {
	private static version = '1.1.0';

	private static classes: IClassses = {
		add: 'dtsb-add',
		button: 'dtsb-button',
		clearGroup: 'dtsb-clearGroup',
		greyscale: 'dtsb-greyscale',
		group: 'dtsb-group',
		inputButton: 'dtsb-iptbtn',
		logic: 'dtsb-logic',
		logicContainer: 'dtsb-logicContainer'
	};

	private static defaults: builderType.IDefaults = {
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
			valueJoiner: 'and'
		},
		logic: 'AND',
		orthogonal: {
			display: 'display',
			search: 'filter',
		},
		preDefined: false
	};

	public classes: IClassses;
	public dom: IDom;
	public c: builderType.IDefaults;
	public s: IS;

	public constructor(
		table: any,
		opts: builderType.IDefaults,
		topGroup: JQuery<HTMLElement>,
		index = 0,
		isChild = false,
		depth = 1
	) {
		// Check that the required version of DataTables is included
		if (! dataTable || ! dataTable.versionCheck || ! dataTable.versionCheck('1.10.0')) {
			throw new Error('SearchBuilder requires DataTables 1.10 or newer');
		}

		this.classes = $.extend(true, {}, Group.classes);

		// Get options from user
		this.c = $.extend(true, {}, Group.defaults, opts);

		this.s = {
			criteria: [],
			depth,
			dt: table,
			index,
			isChild,
			logic: undefined,
			opts,
			toDrop: undefined,
			topGroup
		};

		this.dom = {
			add: $('<button/>')
				.addClass(this.classes.add)
				.addClass(this.classes.button)
				.attr('type', 'button'),
			clear: $('<button>&times</button>')
				.addClass(this.classes.button)
				.addClass(this.classes.clearGroup)
				.attr('type', 'button'),
			container: $('<div/>')
				.addClass(this.classes.group),
			logic: $('<button><div/></button>')
				.addClass(this.classes.logic)
				.addClass(this.classes.button)
				.attr('type', 'button'),
			logicContainer: $('<div/>')
				.addClass(this.classes.logicContainer)
		};

		// A reference to the top level group is maintained throughout any subgroups and criteria that may be created
		if (this.s.topGroup === undefined) {
			this.s.topGroup = this.dom.container;
		}

		this._setup();

		return this;
	}

	/**
	 * Destroys the groups buttons, clears the internal criteria and removes it from the dom
	 */
	public destroy(): void {

		// Turn off listeners
		$(this.dom.add).off('.dtsb');
		$(this.dom.logic).off('.dtsb');

		// Trigger event for groups at a higher level to pick up on
		$(this.dom.container)
			.trigger('dtsb-destroy')
			.remove();

		this.s.criteria = [];
	}

	/**
	 * Gets the details required to rebuild the group
	 */
	// Eslint upset at empty object but needs to be done
	// eslint-disable-next-line @typescript-eslint/ban-types
	public getDetails(): IDetails | {} {
		if (this.s.criteria.length === 0) {
			return {};
		}

		let details: IDetails = {
			criteria: [],
			logic: this.s.logic
		};

		// NOTE here crit could be either a subgroup or a criteria
		for (let crit of this.s.criteria) {
			details.criteria.push(crit.criteria.getDetails());
		}

		return details;
	}

	/**
	 * Getter for the node for the container of the group
	 *
	 * @returns Node for the container of the group
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
	}

	/**
	 * Rebuilds the group based upon the details passed in
	 *
	 * @param loadedDetails the details required to rebuild the group
	 */
	public rebuild(loadedDetails: IDetails | criteriaType.IDetails): void {
		// If no criteria are stored then just return
		if (
			loadedDetails.criteria === undefined ||
			loadedDetails.criteria === null ||
			(Array.isArray(loadedDetails.criteria) && loadedDetails.criteria.length === 0)
		) {
			return;
		}

		this.s.logic = loadedDetails.logic;
		$(this.dom.logic).children().first().text(this.s.logic === 'OR'
			? this.s.dt.i18n('searchBuilder.logicOr', this.c.i18n.logicOr)
			: this.s.dt.i18n('searchBuilder.logicAnd', this.c.i18n.logicAnd)
		);

		// Add all of the criteria, be it a sub group or a criteria
		if(Array.isArray(loadedDetails.criteria)) {
			for (let crit of loadedDetails.criteria) {
				if (crit.logic !== undefined) {
					this._addPrevGroup(crit);
				}
				else if (crit.logic === undefined) {
					this._addPrevCriteria(crit);
				}
			}
		}

		// For all of the criteria children, update the arrows incase they require changing and set the listeners
		for (let crit of this.s.criteria) {
			if (crit.criteria instanceof Criteria) {
				crit.criteria.updateArrows(this.s.criteria.length > 1, false);
				this._setCriteriaListeners(crit.criteria);
			}
		}
	}

	/**
	 * Redraws the Contents of the searchBuilder Groups and Criteria
	 */
	public redrawContents(): void {
		// Clear the container out and add the basic elements
		$(this.dom.container)
			.empty()
			.append(this.dom.logicContainer)
			.append(this.dom.add);

		// Sort the criteria by index so that they appear in the correct order
		this.s.criteria.sort(function(a, b) {
			if (a.criteria.s.index < b.criteria.s.index) {
				return -1;
			}
			else if (a.criteria.s.index > b.criteria.s.index) {
				return 1;
			}

			return 0;
		});

		this.setListeners();

		for (let i = 0; i < this.s.criteria.length; i++) {
			let crit = this.s.criteria[i].criteria;

			if (crit instanceof Criteria) {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Add to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);

				// Set listeners for various points
				this._setCriteriaListeners(crit);
				this.s.criteria[i].criteria.rebuild(this.s.criteria[i].criteria.getDetails());
			}
			else if (crit instanceof Group && crit.s.criteria.length > 0) {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Add the sub group to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);

				// Redraw the contents of the group
				crit.redrawContents();
				this._setGroupListeners(crit);
			}
			else {
				// The group is empty so remove it
				this.s.criteria.splice(i, 1);
				i--;
			}
		}

		this.setupLogic();
	}

	/**
	 * Resizes the logic button only rather than the entire dom.
	 */
	public redrawLogic() {
		for (let crit of this.s.criteria) {
			if (crit instanceof Group) {
				crit.redrawLogic();
			}
		}

		this.setupLogic();
	}

	/**
	 * Search method, checking the row data against the criteria in the group
	 *
	 * @param rowData The row data to be compared
	 * @returns boolean The result of the search
	 */
	public search(rowData: any[], rowIdx: number): boolean {
		if (this.s.logic === 'AND') {
			return this._andSearch(rowData, rowIdx);
		}
		else if (this.s.logic === 'OR') {
			return this._orSearch(rowData, rowIdx);
		}

		return true;
	}

	/**
	 * Locates the groups logic button to the correct location on the page
	 */
	public setupLogic(): void {
		// Remove logic button
		$(this.dom.logicContainer).remove();
		$(this.dom.clear).remove();

		// If there are no criteria in the group then keep the logic removed and return
		if (this.s.criteria.length < 1) {
			if (!this.s.isChild) {
				$(this.dom.container).trigger('dtsb-destroy');
				// Set criteria left margin
				$(this.dom.container).css('margin-left', 0);
			}

			return;
		}

		// Set width, take 2 for the border
		let height = $(this.dom.container).height() - 1;
		$(this.dom.clear).height('0px');
		$(this.dom.logicContainer).append(this.dom.clear).width(height);

		// Prepend logic button
		$(this.dom.container).prepend(this.dom.logicContainer);
		this._setLogicListener();

		// Set criteria left margin
		$(this.dom.container).css('margin-left', $(this.dom.logicContainer).outerHeight(true));

		let logicOffset = $(this.dom.logicContainer).offset();

		// Set horizontal alignment
		let currentLeft = logicOffset.left;
		let groupLeft = $(this.dom.container).offset().left;
		let shuffleLeft = currentLeft - groupLeft;
		let newPos = currentLeft - shuffleLeft - $(this.dom.logicContainer).outerHeight(true);
		$(this.dom.logicContainer).offset({left: newPos});

		// Set vertical alignment
		let firstCrit = $(this.dom.logicContainer).next();
		let currentTop = logicOffset.top;
		let firstTop = $(firstCrit).offset().top;
		let shuffleTop = currentTop - firstTop;
		let newTop = currentTop - shuffleTop;
		$(this.dom.logicContainer).offset({top: newTop});

		$(this.dom.clear).outerHeight($(this.dom.logicContainer).height());

		this._setClearListener();
	}

	/**
	 * Sets listeners on the groups elements
	 */
	public setListeners(): void {
		$(this.dom.add).unbind('click');
		$(this.dom.add).on('click', () => {
			// If this is the parent group then the logic button has not been added yet
			if (!this.s.isChild) {
				$(this.dom.container).prepend(this.dom.logicContainer);
			}

			this.addCriteria();
			$(this.dom.container).trigger('dtsb-add');
			this.s.dt.state.save();

			return false;
		});

		for (let crit of this.s.criteria) {
			crit.criteria.setListeners();
		}

		this._setClearListener();

		this._setLogicListener();
	}

	/**
	 * Adds a criteria to the group
	 *
	 * @param crit Instance of Criteria to be added to the group
	 */
	public addCriteria(crit: Criteria = null, redraw = true): void {
		let index = crit === null ? this.s.criteria.length : crit.s.index;
		let criteria = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, index, this.s.depth);

		// If a Criteria has been passed in then set the values to continue that
		if (crit !== null) {
			criteria.c = crit.c;
			criteria.s = crit.s;
			criteria.s.depth = this.s.depth;
			criteria.classes = crit.classes;
		}

		criteria.populate();
		let inserted = false;

		for (let i = 0; i < this.s.criteria.length; i++) {
			if (i === 0 && this.s.criteria[i].criteria.s.index > criteria.s.index) {
				// Add the node for the criteria at the start of the group
				$(criteria.getNode()).insertBefore(this.s.criteria[i].criteria.dom.container);
				inserted = true;
			}
			else if (
				i < this.s.criteria.length - 1 &&
				this.s.criteria[i].criteria.s.index < criteria.s.index &&
				this.s.criteria[i + 1].criteria.s.index > criteria.s.index
			) {
				// Add the node for the criteria in the correct location
				$(criteria.getNode()).insertAfter(this.s.criteria[i].criteria.dom.container);
				inserted = true;
			}
		}

		if (!inserted) {
			$(criteria.getNode()).insertBefore(this.dom.add);
		}

		// Add the details for this criteria to the array
		this.s.criteria.push({
			criteria,
			index
		});

		this.s.criteria = this.s.criteria.sort((a, b) => a.criteria.s.index - b.criteria.s.index);

		for (let opt of this.s.criteria) {
			if (opt.criteria instanceof Criteria) {
				opt.criteria.updateArrows(this.s.criteria.length > 1, redraw);
			}
		}

		this._setCriteriaListeners(criteria);
		criteria.setListeners();
		this.setupLogic();
	}

	/**
	 * Checks the group to see if it has any filled criteria
	 */
	public checkFilled() {
		for (let crit of this.s.criteria) {
			if (
				(crit.criteria instanceof Criteria && crit.criteria.s.filled) ||
				(crit.criteria instanceof Group && crit.criteria.checkFilled())
			) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Gets the count for the number of criteria in this group and any sub groups
	 */
	public count(): number {
		let count = 0;

		for (let crit of this.s.criteria) {
			if (crit.criteria instanceof Group) {
				count += crit.criteria.count();
			}
			else {
				count ++;
			}
		}

		return count;
	}

	/**
	 * Rebuilds a sub group that previously existed
	 *
	 * @param loadedGroup The details of a group within this group
	 */
	private _addPrevGroup(loadedGroup: IDetails): void {
		let idx = this.s.criteria.length;
		let group = new Group(this.s.dt, this.c, this.s.topGroup, idx, true, this.s.depth + 1);

		// Add the new group to the criteria array
		this.s.criteria.push({
			criteria: group,
			index: idx,
			logic: group.s.logic
		});

		// Rebuild it with the previous conditions for that group
		group.rebuild(loadedGroup);
		this.s.criteria[idx].criteria = group;
		$(this.s.topGroup).trigger('dtsb-redrawContents');
		this._setGroupListeners(group);
	}

	/**
	 * Rebuilds a criteria of this group that previously existed
	 *
	 * @param loadedCriteria The details of a criteria within the group
	 */
	private _addPrevCriteria(loadedCriteria: criteriaType.IDetails): void {
		let idx = this.s.criteria.length;
		let criteria = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, idx, this.s.depth);
		criteria.populate();

		// Add the new criteria to the criteria array
		this.s.criteria.push({
			criteria,
			index: idx
		});

		// Rebuild it with the previous conditions for that criteria
		criteria.rebuild(loadedCriteria);
		this.s.criteria[idx].criteria = criteria;
		$(this.s.topGroup).trigger('dtsb-redrawContents');
	}

	/**
	 * Checks And the criteria using AND logic
	 *
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the AND search
	 */
	private _andSearch(rowData: any[], rowIdx: number): boolean {
		// If there are no criteria then return true for this group
		if (this.s.criteria.length === 0) {
			return true;
		}

		for (let crit of this.s.criteria) {
			// If the criteria is not complete then skip it
			if (crit.criteria instanceof Criteria && !crit.criteria.s.filled) {
				continue;
			}
			// Otherwise if a single one fails return false
			else if (!crit.criteria.search(rowData, rowIdx)) {
				return false;
			}
		}

		// If we get to here then everything has passed, so return true for the group
		return true;
	}

	/**
	 * Checks And the criteria using OR logic
	 *
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the OR search
	 */
	private _orSearch(rowData: any[], rowIdx: number): boolean {
		// If there are no criteria in the group then return true
		if (this.s.criteria.length === 0) {
			return true;
		}

		// This will check to make sure that at least one criteria in the group is complete
		let filledfound = false;

		for (let crit of this.s.criteria) {
			if (crit.criteria instanceof Criteria && crit.criteria.s.filled) {
				// A completed criteria has been found so set the flag
				filledfound = true;

				// If the search passes then return true
				if (crit.criteria.search(rowData, rowIdx)) {
					return true;
				}
			}
			else if (crit.criteria instanceof Group && crit.criteria.checkFilled()) {
				filledfound = true;

				if (crit.criteria.search(rowData, rowIdx)) {
					return true;
				}
			}
		}

		// If we get here we need to return the inverse of filledfound,
		//  as if any have been found and we are here then none have passed
		return !filledfound;
	}

	/**
	 * Removes a criteria from the group
	 *
	 * @param criteria The criteria instance to be removed
	 */
	private _removeCriteria(criteria: Criteria | Group, group = false): void {
		// If removing a criteria and there is only then then just destroy the group
		if (this.s.criteria.length <= 1 && this.s.isChild) {
			this.destroy();
		}
		else {
			// Otherwise splice the given criteria out and redo the indexes
			let last: number;

			for (let i = 0; i < this.s.criteria.length; i++) {
				if (
					this.s.criteria[i].index === criteria.s.index &&
					(!group || this.s.criteria[i].criteria instanceof Group)
				) {
					last = i;
				}
			}

			// We want to remove the last element with the desired index, as its replacement will be inserted before it
			if (last !== undefined) {
				this.s.criteria.splice(last, 1);
			}

			for (let i = 0; i < this.s.criteria.length; i++) {
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;
			}
		}
	}
	/**
	 * Sets the listeners in group for a criteria
	 *
	 * @param criteria The criteria for the listeners to be set on
	 */
	private _setCriteriaListeners(criteria: Criteria): void {
		$(criteria.dom.delete)
			.unbind('click')
			.on('click', () => {
				this._removeCriteria(criteria);
				$(criteria.dom.container).remove();

				for (let crit of this.s.criteria) {
					if (crit.criteria instanceof Criteria) {
						crit.criteria.updateArrows(this.s.criteria.length > 1);
					}
				}

				criteria.destroy();
				this.s.dt.draw();

				$(this.s.topGroup).trigger('dtsb-redrawContents');
				$(this.s.topGroup).trigger('dtsb-updateTitle');

				return false;
			});

		$(criteria.dom.right)
			.unbind('click')
			.on('click', () => {
				let idx = criteria.s.index;
				let group = new Group(
					this.s.dt,
					this.s.opts,
					this.s.topGroup,
					criteria.s.index,
					true,
					this.s.depth + 1
				);

				// Add the criteria that is to be moved to the new group
				group.addCriteria(criteria);

				// Update the details in the current groups criteria array
				this.s.criteria[idx].criteria = group;
				this.s.criteria[idx].logic = 'AND';

				$(this.s.topGroup).trigger('dtsb-redrawContents');

				this._setGroupListeners(group);

				return false;
			});

		$(criteria.dom.left)
			.unbind('click')
			.on('click', () => {
				this.s.toDrop = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, criteria.s.index);
				this.s.toDrop.s = criteria.s;
				this.s.toDrop.c = criteria.c;
				this.s.toDrop.classes = criteria.classes;
				this.s.toDrop.populate();

				// The dropCriteria event mutates the reference to the index so need to store it
				let index = this.s.toDrop.s.index;
				$(this.dom.container).trigger('dtsb-dropCriteria');
				criteria.s.index = index;
				this._removeCriteria(criteria);

				// By tracking the top level group we can directly trigger a redraw on it,
				//  bubbling is also possible, but that is slow with deep levelled groups
				$(this.s.topGroup).trigger('dtsb-redrawContents');

				this.s.dt.draw();

				return false;
			});
	}

	/**
	 * Set's the listeners for the group clear button
	 */
	private _setClearListener(): void {
		$(this.dom.clear)
			.unbind('click')
			.on('click', () => {
				if (!this.s.isChild) {
					$(this.dom.container).trigger('dtsb-clearContents');

					return false;
				}

				this.destroy();
				$(this.s.topGroup).trigger('dtsb-updateTitle');
				$(this.s.topGroup).trigger('dtsb-redrawContents');

				return false;
			});
	}

	/**
	 * Sets listeners for sub groups of this group
	 *
	 * @param group The sub group that the listeners are to be set on
	 */
	private _setGroupListeners(group: Group): void {
		// Set listeners for the new group
		$(group.dom.add)
			.unbind('click')
			.on('click', () => {
				this.setupLogic();
				$(this.dom.container).trigger('dtsb-add');

				return false;
			});

		$(group.dom.container)
			.unbind('dtsb-add')
			.on('dtsb-add', () => {
				this.setupLogic();
				$(this.dom.container).trigger('dtsb-add');

				return false;
			});

		$(group.dom.container)
			.unbind('dtsb-destroy')
			.on('dtsb-destroy', () => {
				this._removeCriteria(group, true);
				$(group.dom.container).remove();
				this.setupLogic();

				return false;
			});

		$(group.dom.container)
			.unbind('dtsb-dropCriteria')
			.on('dtsb-dropCriteria', () => {
				let toDrop = group.s.toDrop;
				toDrop.s.index = group.s.index;
				toDrop.updateArrows(this.s.criteria.length > 1, false);
				this.addCriteria(toDrop, false);

				return false;
			});

		group.setListeners();
	}

	/**
	 * Sets up the Group instance, setting listeners and appending elements
	 */
	private _setup(): void {
		this.setListeners();

		$(this.dom.add).text(this.s.dt.i18n('searchBuilder.add', this.c.i18n.add));
		$(this.dom.logic).children().first().text(this.c.logic === 'OR'
			? this.s.dt.i18n('searchBuilder.logicOr', this.c.i18n.logicOr)
			: this.s.dt.i18n('searchBuilder.logicAnd', this.c.i18n.logicAnd)
		);
		this.s.logic = this.c.logic === 'OR' ? 'OR' : 'AND';

		if (this.c.greyscale) {
			$(this.dom.logic).addClass(this.classes.greyscale);
		}

		$(this.dom.logicContainer).append(this.dom.logic).append(this.dom.clear);

		// Only append the logic button immediately if this is a sub group,
		//  otherwise it will be prepended later when adding a criteria
		if (this.s.isChild) {
			$(this.dom.container).append(this.dom.logicContainer);
		}

		$(this.dom.container).append(this.dom.add);
	}

	/**
	 * Sets the listener for the logic button
	 */
	private _setLogicListener(): void {
		$(this.dom.logic)
			.unbind('click')
			.on('click', () => {
				this._toggleLogic();
				this.s.dt.draw();

				for (let crit of this.s.criteria) {
					crit.criteria.setListeners();
				}
			});
	}

	/**
	 * Toggles the logic for the group
	 */
	private _toggleLogic(): void {
		if (this.s.logic === 'OR') {
			this.s.logic = 'AND';
			$(this.dom.logic).children().first().text(this.s.dt.i18n('searchBuilder.logicAnd', this.c.i18n.logicAnd));
		}
		else if (this.s.logic === 'AND') {
			this.s.logic = 'OR';
			$(this.dom.logic).children().first().text(this.s.dt.i18n('searchBuilder.logicOr', this.c.i18n.logicOr));
		}
	}
}
