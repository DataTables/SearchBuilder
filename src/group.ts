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

import Criteria from './criteria';

/**
 * The Group class is used within SearchBuilder to represent a group of criteria
 */
export default class Group {
	private static version = '0.0.1';

	private static classes = {
		add: 'dtsb-add',
		button: 'dtsb-button',
		clearGroup: 'dtsb-clearGroup',
		group: 'dtsb-group',
		indentSub: 'dtsb-indentSub',
		indentTop: 'dtsb-indentTop',
		inputButton: 'dtsb-iptbtn',
		logic: 'dtsb-logic',
		roundButton: 'dtsb-rndbtn'
	};

	private static defaults = {
		depthLimit: false
	};

	public classes;
	public dom;
	public c;
	public s;
	private dropOnce;

	constructor(table, opts, index = 0, isChild = false, depth = 1) {
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
			subgroups: [],
		};

		this.dom = {
			add: $('<button/>').addClass(this.classes.add).addClass(this.classes.button),
			clear: $('<button/>').addClass(this.classes.roundButton).addClass(this.classes.clearGroup).text('x'),
			container: $('<div/>').addClass(this.classes.group),
			logic: $('<button/>').addClass(this.classes.logic).addClass(this.classes.button)
		};

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
	 * Redraws the Contents of the searchBuilder Groups and Criteria
	 */
	public redrawContents(): void {
		// Clear the container out and add the basic elements
		$(this.dom.container).empty();
		$(this.dom.container).append(this.dom.logic).append(this.dom.add);

		this.setListeners();

		for (let i = 0; i < this.s.criteria.length; i++) {
			if (this.s.criteria[i].type === 'criteria') {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Set listeners for various points
				this._setCriteriaListeners(this.s.criteria[i].criteria);
				this.s.criteria[i].criteria.setListeners();

				if (this.s.criteria.length === 1 || this.s.depth === this.c.depthLimit) {
					$(this.s.criteria[i].criteria.dom.right).attr('disabled', true);
				}

				// Add to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
			}
			else if (this.s.criteria[i].criteria.s.criteria.length > 0) {
				// Reset the index to the new value
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;

				// Add the sub group to the group
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);

				// Redraw the contents of the group
				this.s.criteria[i].criteria.redrawContents();

				this.s.criteria[i].criteria.setupLogic();
				this._setGroupListeners(this.s.criteria[i].criteria);
			}
			else {
				// The group is empty so remove it
				this.s.criteria.splice(i, 1);
				i--;
			}
		}
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

		return true;
	}

	/**
	 * Locates the groups logic button to the correct location on the page
	 */
	public setupLogic() {
		// Remove logic button
		$(this.dom.logic).remove();
		$(this.dom.clear).remove();

		if (this.s.criteria.length < 1) {
			$(this.dom.container).removeClass(this.classes.indentTop).removeClass(this.classes.indentSub);

			return;
		}

		// Set width
		let width = this.s.criteria.length < 2 || !this.s.isChild ?
			$(this.dom.container).height() :
			$(this.dom.container).height() - 32;
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

		if (this.s.criteria.length > 1 && this.s.isChild) {
			// Append clear Group
			$(this.dom.clear).insertAfter(this.dom.logic);

			// Set horizontal alignment
			let currentLeftBtn = $(this.dom.clear).offset().left;
			let shuffleLeftBtn = currentLeftBtn - groupLeft;
			let newPosBtn = currentLeftBtn - shuffleLeftBtn - $(this.dom.clear).width() - 22;
			$(this.dom.clear).offset({left: newPosBtn});

			// Set vertical alignment
			let currentTopBtn = $(this.dom.clear).offset().top;
			let shuffleTopBtn = currentTopBtn - (newTop + $(this.dom.logic).outerWidth() + 3);
			let newTopBtn = currentTopBtn - shuffleTopBtn;
			$(this.dom.clear).offset({top: newTopBtn});

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
				$(this.dom.container).prepend(this.dom.logic);
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
		let criteria = new Criteria(this.s.dt, this.s.opts, index, this.s.depth);

		// If a Criteria has been passed in then set the values to continue that
		if (crit !== null) {
			criteria.c = crit.c;
			criteria.s = crit.s;
			criteria.s.depth = this.s.depth;
			criteria.s.index = index;
			criteria.classes = crit.classes;
		}

		criteria.populate();

		// If this is a sub group then add the left button
		criteria.updateArrows();

		// Add the node for the new criteria to the end of the current criteria
		$(criteria.getNode()).insertBefore(this.dom.add);

		// Add the details for this criteria to the array
		this.s.criteria.push({
			criteria,
			index,
			type: 'criteria'
		});

		// If there are not more than one criteria in this group then enable the right button, if not disable it
		if (this.s.criteria.length > 1 && (this.c.depthLimit === false || this.s.depth < this.c.depthLimit)) {
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

		this._setCriteriaListeners(criteria);
		criteria.setListeners();
		this.setupLogic();
	}

	/**
	 * Checks all of the criteria using AND logic
	 * @param rowData The row data to be checked against the search criteria
	 * @returns boolean The result of the AND search
	 */
	private _andSearch(rowData): boolean {
		if (this.s.criteria.length === 0) {
			return true;
		}

		for (let crit of this.s.criteria) {
			if (crit.type === 'criteria' && !crit.criteria.s.filled) {
				continue;
			}
			else if (!crit.criteria.search(rowData)) {
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
		if (this.s.criteria.length === 0) {
			return true;
		}

		let filledfound = false;

		for (let crit of this.s.criteria) {
			if (crit.criteria.s.filled) {
				filledfound = true;
				if (crit.criteria.search(rowData)) {
					return true;
				}
			}
		}

		return !filledfound;
	}

	/**
	 * Removes a criteria from the group
	 * @param criteria The criteria instance to be removed
	 */
	private _removeCriteria(criteria): void {
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
	private _setCriteriaListeners(criteria): void {
		$(criteria.dom.delete).on('click', () => {
			this._removeCriteria(criteria);
			$(criteria.dom.container).remove();
			this.setupLogic();
		});

		$(criteria.dom.right).on('click', () => {
			let idx = criteria.s.index;
			let group = new Group(this.s.dt, this.c, criteria.s.index, true, this.s.depth + 1);

			// Add the criteria that is to be moved to the new group
			group.addCriteria(criteria);

			// Update the details in the current groups criteria array
			this.s.criteria[idx].criteria = group;
			this.s.criteria[idx].type = 'group';

			$(document).trigger('dtsb-redrawContents');

			this._setGroupListeners(group);
		});

		$(criteria.dom.left).on('click', () => {
			this.s.toDrop = new Criteria(this.s.dt, this.s.opts, criteria.s.index);
			this.s.toDrop.s = criteria.s;
			this.s.toDrop.c = criteria.c;
			this.s.toDrop.classes = criteria.classes;
			this.s.toDrop.populate();
			$(this.dom.container).trigger('dtsb-dropCriteria');
			this._removeCriteria(criteria);
			$(document).trigger('dtsb-redrawContents');
		});
	}

	/**
	 * Set's the listeners for the group clear button
	 */
	private _setClearListener() {
		$(this.dom.clear).unbind('click');
		$(this.dom.clear).on('click', () => {
			this.destroy();
		});
	}

	/**
	 * Sets listeners for sub groups of this group
	 * @param group The sub group that the listeners are to be set on
	 */
	private _setGroupListeners(group) {
		// Set listeners for the new group
		$(group.dom.add).unbind('click');
		group.setListeners();
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
				toDrop.updateArrows();
				this.addCriteria(toDrop);
				$(document).trigger('dtsb-redrawContents');
		});
	}

	/**
	 * Sets up the Group instance, setting listeners and appending elements
	 */
	private _setup(): void {
		this.setListeners();

		$(this.dom.add).text('ADD');
		$(this.dom.logic).text('Set');

		// Only append the logic button immediately if this is a sub group,
		//  otherwise it will be prepended later when adding a criteria
		if (this.s.isChild) {
			$(this.dom.container).append(this.dom.logic);
			$(this.dom.container).addClass(this.classes.indentSub);
		}

		$(this.dom.container).append(this.dom.add);

		if (!this.s.isChild) {
			$(document).on('dtsb-redrawContents', () => {
				this.redrawContents();
				this.setupLogic();
			});
		}
	}

	/**
	 * Sets the listener for the logic button
	 */
	private _setLogicListener() {
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
