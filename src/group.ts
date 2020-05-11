import * as critTypeInterfaces from './criteriaType';
import * as typeInterfaces from './groupType';

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

import Criteria from './criteria';

/**
 * The Group class is used within SearchBuilder to represent a group of criteria
 */
export default class Group {
	private static version = '0.0.1';

	private static classes: typeInterfaces.IClassses = {
		add: 'dtsb-add',
		button: 'dtsb-button',
		clearGroup: 'dtsb-clearGroup',
		greyscale: 'dtsb-greyscale',
		group: 'dtsb-group',
		indentSub: 'dtsb-indentSub',
		indentTop: 'dtsb-indentTop',
		inputButton: 'dtsb-iptbtn',
		logic: 'dtsb-logic',
		logicContainer: 'dtsb-logicContainer'
	};

	private static defaults: typeInterfaces.IDefaults = {
		depthLimit: false,
		greyscale: false,
		logic: 'AND'
	};

	public classes: typeInterfaces.IClassses;
	public dom: typeInterfaces.IDom;
	public c: typeInterfaces.IDefaults;
	public s: typeInterfaces.IS;

	constructor(table: any, opts: any, topGroup: JQuery<HTMLElement>, index = 0, isChild = false, depth = 1) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
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
			add: $('<button/>').addClass(this.classes.add).addClass(this.classes.button),
			clear: $('<button>&times</button>').addClass(this.classes.button).addClass(this.classes.clearGroup),
			container: $('<div/>').addClass(this.classes.group),
			logic: $('<button/>').addClass(this.classes.logic).addClass(this.classes.button),
			logicContainer: $('<div/>').addClass(this.classes.logicContainer)
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
		$(this.dom.container).trigger('dtsb-destroy');

		this.s.criteria = [];
		$(this.dom.container).remove();
	}

	/**
	 * Gets the details required to rebuild the group
	 */
	public getDetails(): typeInterfaces.IDetails {
		let details: typeInterfaces.IDetails = {
			criteria: [],
			logic: this.s.logic,
			type: 'group'
		};

		// NOTE here crit could be either a subgroup or a criteria
		for (let crit of this.s.criteria) {
			details.criteria.push(crit.criteria.getDetails());
		}

		return details;
	}

	/**
	 * Getter for the node for the container of the group
	 * @returns Node for the container of the group
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
	}

	/**
	 * Rebuilds the group based upon the details passed in
	 * @param loadedDetails the details required to rebuild the group
	 */
	public rebuild(loadedDetails: typeInterfaces.IDetails): void {
		// If no criteria are stored then just return
		if (loadedDetails.criteria === undefined || loadedDetails.criteria === null || loadedDetails.criteria.length === 0) {
			return;
		}

		$(this.dom.container).addClass(this.s.isChild ? this.classes.indentSub : this.classes.indentTop);
		this.s.logic = loadedDetails.logic;
		$(this.dom.logic).text(this.s.logic === 'OR' ? this.s.dt.i18n('searchBuilder.logicOr', 'Or') : this.s.dt.i18n('searchBuilder.logicAnd', 'And'));

		// Add all of the criteria, be it a sub group or a criteria
		for (let crit of loadedDetails.criteria) {
			if (crit.type === 'group') {
				this._addPrevGroup(crit);
			}
			else if (crit.type === 'criteria') {
				this._addPrevCriteria(crit);
			}
		}
	}

	/**
	 * Redraws the Contents of the searchBuilder Groups and Criteria
	 */
	public redrawContents(): void {
		// Clear the container out and add the basic elements
		$(this.dom.container).empty();
		$(this.dom.container).append(this.dom.logicContainer).append(this.dom.add);

		this.setListeners();

		for (let i = 0; i < this.s.criteria.length; i++) {
			if (this.s.criteria[i].type === 'criteria') {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				this.s.criteria[i].criteria.updateArrows(this.s.criteria.length > 1);

				// If there is only one criteria or the depthLimit has been reached then don't allow right movement
				if ((this.s.criteria.length === 1 || this.s.depth === this.c.depthLimit)) {
					$(this.s.criteria[i].criteria.dom.right).attr('disabled', true);
				}
				else {
					$(this.s.criteria[i].criteria.dom.right).attr('disabled', false);
				}

				// Add to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);

				// Set listeners for various points
				this._setCriteriaListeners(this.s.criteria[i].criteria);
				this.s.criteria[i].criteria.setListeners();
			}
			else if (this.s.criteria[i].criteria.s.criteria.length > 0) {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Add the sub group to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);

				// Redraw the contents of the group
				this.s.criteria[i].criteria.redrawContents();
				this._setGroupListeners(this.s.criteria[i].criteria);
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
	 * Search method, checking the row data against the criteria in the group
	 * @param rowData The row data to be compared
	 * @returns boolean The result of the search
	 */
	public search(rowData: any[]): boolean {
		if (this.s.logic === 'AND') {
			return this._andSearch(rowData);
		}
		else if (this.s.logic === 'OR') {
			return this._orSearch(rowData);
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
			$(this.dom.container).removeClass(this.classes.indentTop).removeClass(this.classes.indentSub);
			if (!this.s.isChild) {
				$(this.dom.container).trigger('dtsb-destroy');
			}

			return;
		}

		// Set width, take 2 for the border
		let height = $(this.dom.container).height() - 2;
		$(this.dom.logicContainer).width(height);
		// $(this.dom.logicContainer).outerWidth(height, true);

		// Prepend logic button
		$(this.dom.container).prepend(this.dom.logicContainer);
		this._setLogicListener();

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

		if (this.s.criteria.length > 1 && this.s.isChild) {
			// Append clear Group
			$(this.dom.clear).insertAfter(this.dom.logic);
			this._setClearListener();
		}

	}

	/**
	 * Sets listeners on the groups elements
	 */
	public setListeners(): void {
		$(this.dom.add).on('click', () => {
			// If this is the parent group then the logic button has not been added yet
			if (!this.s.isChild) {
				$(this.dom.container).addClass(this.classes.indentTop);
				$(this.dom.container).prepend(this.dom.logicContainer);
			}

			this.addCriteria();
		});

		this._setClearListener();

		this._setLogicListener();
	}

	/**
	 * Adds a criteria to the group
	 * @param crit Instance of Criteria to be added to the group
	 */
	public addCriteria(crit: Criteria = null): void {
		let index = this.s.criteria.length;
		let criteria = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, index, this.s.depth);

		// If a Criteria has been passed in then set the values to continue that
		if (crit !== null) {
			criteria.c = crit.c;
			criteria.s = crit.s;
			criteria.s.depth = this.s.depth;
			criteria.s.index = index;
			criteria.classes = crit.classes;
		}

		criteria.populate();

		// Add the node for the new criteria to the end of the current criteria
		$(criteria.getNode()).insertBefore(this.dom.add);

		// Add the details for this criteria to the array
		this.s.criteria.push({
			criteria,
			index,
			type: 'criteria'
		});

		for (let opt of this.s.criteria) {
			if (opt.type === 'criteria') {
				opt.criteria.updateArrows(this.s.criteria.length > 1);
			}
		}

		// If there are not more than one criteria in this group then enable the right button, if not disable it
		if (this.s.criteria.length > 1 && (this.c.depthLimit === false || this.s.depth < this.c.depthLimit)) {
			for (let opt of this.s.criteria) {
				$(opt.criteria.dom.right).attr('disabled', false);
			}
		}
		else {
			for (let opt of this.s.criteria) {
				$(opt.criteria.dom.right).attr('disabled', true);
			}
		}

		this._setCriteriaListeners(criteria);
		criteria.setListeners();
		this.setupLogic();
	}

	/**
	 * Rebuilds a sub group that previously existed
	 * @param loadedGroup The details of a group within this group
	 */
	private _addPrevGroup(loadedGroup: typeInterfaces.IDetails): void {
		let idx = this.s.criteria.length;
		let group = new Group(this.s.dt, this.c, this.s.topGroup, idx, true, this.s.depth + 1);

		this.s.criteria.push({
			criteria: group,
			index: idx,
			type: 'group'
		});

		group.rebuild(loadedGroup);

		this.s.criteria[idx].criteria = group;

		$(this.s.topGroup).trigger('dtsb-redrawContents');

		this._setGroupListeners(group);
	}

	/**
	 * Rebuilds a criteria of this group that previously existed
	 * @param loadedCriteria The details of a criteria within the group
	 */
	private _addPrevCriteria(loadedCriteria: critTypeInterfaces.IDetails): void {
		let idx = this.s.criteria.length;
		let criteria = new Criteria(this.s.dt, this.s.opts, this.s.topGroup, idx, this.s.depth);

		criteria.populate();

		this.s.criteria.push({
			criteria,
			index: idx,
			type: 'criteria'
		});

		$(this.s.topGroup).trigger('dtsb-redrawContents');

		criteria.rebuild(loadedCriteria);

		this.s.criteria[idx].criteria = criteria;

		$(this.s.topGroup).trigger('dtsb-redrawContents');
	}

	/**
	 * Checks And the criteria using AND logic
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the AND search
	 */
	private _andSearch(rowData: any[]): boolean {
		// If there are no criteria then return true for this group
		if (this.s.criteria.length === 0) {
			return true;
		}

		for (let crit of this.s.criteria) {
			// If the criteria is not complete then skip it
			if (crit.type === 'criteria' && !crit.criteria.s.filled) {
				continue;
			}
			// Otherwise if a single one fails return false
			else if (!crit.criteria.search(rowData)) {
				return false;
			}
		}

		// If we get to here then everything has passed, so return true for the group
		return true;
	}

	/**
	 * Checks And the criteria using OR logic
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the OR search
	 */
	private _orSearch(rowData: any[]): boolean {
		// If there are no criteria in the group then return true
		if (this.s.criteria.length === 0) {
			return true;
		}

		// This will check to make sure that at least one criteria in the group is complete
		let filledfound = false;

		for (let crit of this.s.criteria) {
			if (crit.criteria.s.filled) {
				// A completed criteria has been found so set the flag
				filledfound = true;
				// If the search passes then return true
				if (crit.criteria.search(rowData)) {
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
	 * @param criteria The criteria instance to be removed
	 */
	private _removeCriteria(criteria: Criteria): void {
		// If removing a criteria and there is only then then just destroy the group
		if (this.s.criteria.length <= 1 && this.s.isChild) {
			this.destroy();
		}
		else {
			// Otherwise splice the given criteria out and redo the indexes
			for (let i = 0; i < this.s.criteria.length; i++) {
				if (this.s.criteria[i].index === criteria.s.index) {
					this.s.criteria.splice(i, 1);
					break;
				}
			}

			for (let i = 0; i < this.s.criteria.length; i++) {
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;
				if (this.s.criteria.length === 1 || this.s.depth === this.c.depthLimit) {
					$(this.s.criteria[i].criteria.dom.right).attr('disabled', true);
				}
			}
		}
	}

	/**
	 * Sets the listeners in group for a criteria
	 * @param criteria The criteria for the listeners to be set on
	 */
	private _setCriteriaListeners(criteria: Criteria): void {
		$(criteria.dom.delete).unbind('click');
		$(criteria.dom.delete).on('click', () => {
			this._removeCriteria(criteria);
			$(criteria.dom.container).remove();
			this.setupLogic();
		});

		$(criteria.dom.right).unbind('click');
		$(criteria.dom.right).on('click', () => {
			console.log("right");
			let idx = criteria.s.index;
			let group = new Group(this.s.dt, this.s.opts, this.s.topGroup, criteria.s.index, true, this.s.depth + 1);

			// Add the criteria that is to be moved to the new group
			group.addCriteria(criteria);

			// Update the details in the current groups criteria array
			this.s.criteria[idx].criteria = group;
			this.s.criteria[idx].type = 'group';

			$(this.s.topGroup).trigger('dtsb-redrawContents');

			this._setGroupListeners(group);
		});

		$(criteria.dom.left).unbind('click');
		$(criteria.dom.left).on('click', () => {
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
		});
	}

	/**
	 * Set's the listeners for the group clear button
	 */
	private _setClearListener(): void {
		$(this.dom.clear).unbind('click');
		$(this.dom.clear).on('click', () => {
			this.destroy();
		});
	}

	/**
	 * Sets listeners for sub groups of this group
	 * @param group The sub group that the listeners are to be set on
	 */
	private _setGroupListeners(group: any): void {
		// Set listeners for the new group
		$(group.dom.add).unbind('click');
		$(group.dom.add).on('click', () => {
			this.setupLogic();
			$(this.dom.container).trigger('dtsb-add');
		});

		$(group.dom.container).unbind('dtsb-add');
		$(group.dom.container).on('dtsb-add', () => {
			this.setupLogic();
			$(this.dom.container).trigger('dtsb-add');
		});

		$(group.dom.container).unbind('dtsb-destroy');
		$(group.dom.container).on('dtsb-destroy', () => {
			this._removeCriteria(group);
			$(group.dom.container).remove();
			this.setupLogic();
		});

		$(group.dom.container).unbind('dtsb-dropCriteria');
		$(group.dom.container).one('dtsb-dropCriteria', () => {
				let toDrop = group.s.toDrop;
				let length = this.s.criteria.length;
				toDrop.s.index = length;
				toDrop.updateArrows(this.s.criteria.length > 1);
				this.addCriteria(toDrop);
				$(this.s.topGroup).trigger('dtsb-redrawContents');
		});

		group.setListeners();
	}

	/**
	 * Sets up the Group instance, setting listeners and appending elements
	 */
	private _setup(): void {
		this.setListeners();

		$(this.dom.add).text(this.s.dt.i18n('searchBuilder.add', 'Add Condition'));
		$(this.dom.logic).text(this.c.logic === 'OR' ? this.s.dt.i18n('searchBuilder.logicOr', 'Or') : this.s.dt.i18n('searchBuilder.logicAnd', 'And'));
		this.s.logic = this.c.logic === 'OR' ? 'OR' : 'AND';

		if (this.c.greyscale) {
			$(this.dom.logic).addClass(this.classes.greyscale);
		}

		$(this.dom.logicContainer).prepend(this.dom.logic);

		// Only append the logic button immediately if this is a sub group,
		//  otherwise it will be prepended later when adding a criteria
		if (this.s.isChild) {
			$(this.dom.container).append(this.dom.logicContainer);
			$(this.dom.container).addClass(this.classes.indentSub);
		}

		$(this.dom.container).append(this.dom.add);
	}

	/**
	 * Sets the listener for the logic button
	 */
	private _setLogicListener(): void {
		$(this.dom.logic).unbind('click');
		$(this.dom.logic).on('click', () => {
			this._toggleLogic();
			this.s.dt.draw();
		});
	}

	/**
	 * Toggles the logic for the group
	 */
	private _toggleLogic(): void {
		if (this.s.logic === 'OR') {
			this.s.logic = 'AND';
			$(this.dom.logic).text(this.s.dt.i18n('searchBuilder.logicAnd', 'And'));
		}
		else if (this.s.logic === 'AND') {
			this.s.logic = 'OR';
			$(this.dom.logic).text(this.s.dt.i18n('searchBuilder.logicOr', 'Or'));
		}
	}
}
