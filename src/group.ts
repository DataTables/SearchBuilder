let $;
let DataTable;

export function setJQuery(jq) {
  $ = jq;
  DataTable = jq.fn.dataTable;
};

import Criteria from './criteria';

export default class Group {
	private static version = '0.0.1';

	private static classes = {
		group: 'dtsb-group',
		add: 'dtsb-add',
		logic: 'dtsb-logic',
		button: 'dtsb-button',
		inputButton: 'dtsb-iptbtn',
		indentSub: 'dtsb-indentSub',
		indentTop: 'dtsb-indentTop',
		roundButton: 'dtsb-rndbtn'
	}

	private static defaults = {

	}

	public classes;
	public dom;
	public c;
	public s;

	constructor(table, index = 0, isChild = false) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
			throw new Error('SearchPane requires DataTables 1.10 or newer');
		}

		this.classes = $.extend(true, {}, Group.classes);

		// Get options from user
		this.c = $.extend(true, {}, Group.defaults);

		this.s = {
			isChild,
			dt: table,
			criteria: [],
			index,
			logic: undefined,
			subgroups: [],
		}

		this.dom = {
			container: $('<div/>').addClass(this.classes.group),
			add: $('<button/>').addClass(this.classes.add).addClass(this.classes.button),
			logic: $('<button/>').addClass(this.classes.logic).addClass(this.classes.button)
		}

		this._setup();
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
	 * Getter for the node for the container of the group
	 * @returns Node for the container of the group
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
	}

	/**
	 * Search method, checking the row data against the criteria in the group
	 * @param rowData The row data to be compared
	 * @returns boolean The result of the search
	 */
	public search(rowData): boolean {
		if (this.s.logic === 'AND') {
			return this._andSearch(rowData);
		}
		else if (this.s.logic === 'OR') {
			return this._orSearch(rowData);
		}
		return false;
	}

	/**
	 * Adds a criteria to the group
	 * @param crit Instance of Criteria to be added to the group
	 */
	private _addCriteria(crit: Criteria = null): void {
		let index = this.s.criteria.length;
		let criteria = new Criteria(undefined, this.s.dt, index);

		// If a Criteria has been passed in then set the values to continue that
		if (crit !== null) {
			criteria.c = crit.c;
			criteria.s = crit.s;
			criteria.s.index = index;
			criteria.classes = crit.classes;
		}

		// If this is a sub group then add the left button
		if (this.s.isChild) {
			criteria.addLeft();
		}

		// Add the node for the new criteria to the end of the current criteria
		$(criteria.getNode()).insertBefore(this.dom.add);

		// Add the details for this criteria to the array
		this.s.criteria.push({
			criteria,
			index,
			type: 'criteria'
		})

		// If there are not more than one criteria in this group then enable the right button, if not disable it
		if (this.s.criteria.length > 1) {
			for (let opt of this.s.criteria) {
				$(opt.criteria.dom.right).removeClass(this.classes.disabled);
				$(opt.criteria.dom.right).attr('disabled', false);
			}
		}
		else {
			for (let opt of this.s.criteria) {
				$(opt.criteria.dom.right).addClass(this.classes.disabled);
				$(opt.criteria.dom.right).attr('disabled', true);
			}
		}

		this._setCriteriaListeners(criteria)
		criteria.setListeners();

		this.setupLogic();
	}

	/**
	 * Checks all of the criteria using AND logic
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the AND search
	 */
	private _andSearch(rowData): boolean {
		for (let crit of this.s.criteria) {
			if (!crit.exec(rowData)) {
				return false;
			}
		}
		for (let gro of this.s.subgroups) {
			if (!gro.search(rowData)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Checks all of the criteria using OR logic
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the OR search
	 */
	private _orSearch(rowData): boolean {
		for (let crit of this.s.criteria) {
			if ($(crit.dom.condition).children('option:selected').val().comparator(rowData)) {
				return true;
			}
		}
		for (let gro of this.s.subgroups) {
			if (gro.search(rowData)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Redraws the Contents of the searchBuilder Groups and Criteria
	 */
	public _redrawContents(): void {
		// Clear the container out and add the basic elements
		$(this.dom.container).empty();
		$(this.dom.container).append(this.dom.logic).append(this.dom.add);

		this._setListeners();

		for (let i = 0; i < this.s.criteria.length; i++) {
			if (this.s.criteria[i].type === 'criteria') {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Set listeners for various points
				this._setCriteriaListeners(this.s.criteria[i].criteria);
				this.s.criteria[i].criteria.setListeners();

				// Add to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
			}
			else if (this.s.criteria[i].criteria.s.criteria.length > 0) {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Redraw the contents of the group
				this.s.criteria[i].criteria._redrawContents();

				// Add the sub group to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
				this.s.criteria[i].criteria.setupLogic();
				this._setGroupListeners(this.s.criteria[i].criteria);
			}
			else {
				// The group is empty so remove it
				this.s.criteria.splice(i, 1);
				i--;
			}
		}

		// this.setupLogic();
	}

	/**
	 * Removes a criteria from the group
	 * @param criteria The criteria instance to be removed
	 */
	private _removeCriteria(criteria): void {
		// If removing a criteria and there is only then then just destroy the group
		if (this.s.criteria.length === 1 && this.s.isChild) {
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
			}
		}
	}

	/**
	 * Sets the listeners in group for a criteria
	 * @param criteria The criteria for the listeners to be set on
	 */
	private _setCriteriaListeners(criteria): void {
		$(criteria.dom.delete).on('click', () => {
			this._removeCriteria(criteria);
			$(criteria.dom.container).remove();
			this.setupLogic();
		});

		$(criteria.dom.right).on('click', () => {
			let idx = criteria.s.index;
			let group = new Group(this.s.dt, criteria.s.index, true);

			// Add the criteria that is to be moved to the new group
			group._addCriteria(criteria);

			// Update the details in the current groups criteria array
			this.s.criteria[idx].criteria = group;
			this.s.criteria[idx].type = 'group';

			$(document).trigger('dtsb-redrawContents');

			this._setGroupListeners(group);
		});

		$(criteria.dom.left).on('click', () => {
			this.s.toDrop = new Criteria(undefined, this.s.dt, criteria.s.index);
			this.s.toDrop.s = criteria.s;
			this.s.toDrop.c = criteria.c;
			this.s.toDrop.classes = criteria.classes;
			$(this.dom.container).trigger('dtsb-dropCriteria');
			this._removeCriteria(criteria);
			$(document).trigger('dtsb-redrawContents');
		});
	}

	private _setGroupListeners(group) {
		$(group.dom.add).on('click', () => {
			this.setupLogic();
		})

		// Set listeners for the new group
		$(group.dom.container).on('dtsb-destroy', () => {
			this._removeCriteria(group);
			$(group.dom.container).remove();
			this.setupLogic();
		});

		$(group.dom.container).on('dtsb-dropCriteria', () => {
			let toDrop = group.s.toDrop;
			let length = this.s.criteria.length;
			toDrop.s.index = length;
			toDrop.removeLeft();
			this._addCriteria(toDrop);
			$(document).trigger('dtsb-redrawContents');
		});
	}

	/**
	 * Sets up the Group instance, setting listeners and appending elements
	 */
	private _setup(): void {
		this._setListeners();

		$(this.dom.add).text('ADD');
		$(this.dom.logic).text('Set');

		// Only append the logic button immediately if this is a sub group, otherwise it will be prepended later when adding a criteria
		if (this.s.isChild) {
			$(this.dom.container).append(this.dom.logic);
			$(this.dom.container).addClass(this.classes.indentSub);
		}

		$(this.dom.container).append(this.dom.add);

		if (!this.s.isChild) {
			$(document).on('dtsb-redrawContents', () => {
				this._redrawContents();
				this.setupLogic();
			});
		}
	}

	public setupLogic() {
		// Remove logic button
		$(this.dom.logic).remove();

		if (this.s.criteria.length < 1) {
			$(this.dom.container).removeClass(this.classes.indentTop).removeClass(this.classes.indentSub);
			return;
		}

		// Set width
		let width = $(this.dom.container).height();
		$(this.dom.logic).width(width);

		// Prepend logic button
		$(this.dom.container).prepend(this.dom.logic);
		this._setLogicListener();

		// Set horizontal alignment
		let currentLeft = $(this.dom.logic).offset().left;
		let groupLeft = $(this.dom.container).offset().left;
		let shuffleLeft = currentLeft - groupLeft;
		let newPos = currentLeft - shuffleLeft - $(this.dom.logic).height() - 20;
		$(this.dom.logic).offset({left: newPos});

		// Set vertical alignment
		let firstCrit = $(this.dom.logic).next();
		let currentTop = $(this.dom.logic).offset().top;
		let firstTop = $(firstCrit).offset().top;
		let shuffleTop = currentTop - firstTop;
		let newTop = currentTop - shuffleTop;
		$(this.dom.logic).offset({top: newTop});

		console.log("just to mark");
	}

	/**
	 * Sets listeners on the groups elements
	 */
	private _setListeners(): void {
		$(this.dom.add).on('click', () => {
			// If this is the parent group then the logic button has not been added yet
			if (!this.s.isChild) {
				$(this.dom.container).addClass(this.classes.indentTop);
				$(this.dom.container).prepend(this.dom.logic);
			}

			this._addCriteria();
		})

		this._setLogicListener()
	}

	private _setLogicListener() {
		$(this.dom.logic).on('click', () => {
			this._toggleLogic();
		})
	}

	/**
	 * Toggles the logic for the group
	 */
	private _toggleLogic(): void {
		if (this.s.logic === undefined || this.s.logic === 'OR') {
			this.s.logic = 'AND';
			$(this.dom.logic).text('All Of');
		}
		else if (this.s.logic === 'AND') {
			this.s.logic = 'OR';
			$(this.dom.logic).text('Any Of');
		}
	}
}
