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

		this.setup();

	}

	public destroy() {
		$(this.dom.add).off('.dtsb');

		$(this.dom.container).trigger('dtsb-destroy');

		this.s.criteria = [];
		$(this.dom.container).remove();
	}

	public getNode() {
		return this.dom.container;
	}

	public search(rowData) {
		if (this.s.logic === 'AND') {
			this.andSearch(rowData);
		}
		else if (this.s.logic === 'OR') {
			this.orSearch(rowData);
		}
	}

	private andSearch(rowData) {
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

	private orSearch(rowData) {
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

	private setup() {
		this.setListeners();

		$(this.dom.add).text('ADD');
		$(this.dom.logic).text('Set Logic');
		$(this.dom.container).append(this.dom.logic);
		$(this.dom.container).append(this.dom.add);

		if (!this.s.isChild) {
			$(document).on('dtsb-redrawContents', () => {
				this.redrawContents();
			});
		}
	}

	private setListeners() {
		$(this.dom.add).on('click', () => {
			this.addCriteria();
		})

		$(this.dom.logic).on('click', () => {
			this.toggleLogic();
		})
	}

	private redrawContents() {
		$(this.dom.container).empty();
		$(this.dom.container).append(this.dom.logic).append(this.dom.add);

		this.setListeners();

		for (let i = 0; i < this.s.criteria.length; i++) {
			if (this.s.criteria[i].type === 'criteria') {
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;
				this.setCriteriaListeners(this.s.criteria[i].criteria);
				this.s.criteria[i].criteria.setListeners();
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
			}
			else if (this.s.criteria[i].criteria.s.criteria.length > 0) {
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;
				this.s.criteria[i].criteria.redrawContents();
				$(this.s.criteria[i].criteria.dom.container).insertBefore(this.dom.add);
			}
			else {
				this.s.criteria.splice(i, 1);
				i--;
			}
		}
	}

	private toggleLogic() {
		if (this.s.logic === undefined || this.s.logic === 'OR') {
			this.s.logic = 'AND';
			$(this.dom.logic).text('All Of');
		}
		else if (this.s.logic === 'AND') {
			this.s.logic = 'OR';
			$(this.dom.logic).text('Any Of');
		}
	}

	private addCriteria(crit = null) {
		let index = this.s.criteria.length;
		let criteria = new Criteria(undefined, this.s.dt, index);
		if (crit !== null) {
			criteria.c = crit.c;
			criteria.s = crit.s;
			criteria.s.index = index;
			// criteria.dom = crit.dom;
			criteria.classes = crit.classes;
		}

		if (this.s.isChild) {
			criteria.addLeft();
		}

		$(criteria.getNode()).insertBefore(this.dom.add);

		this.s.criteria.push({
			criteria,
			index,
			type: 'criteria'
		})

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

		this.setCriteriaListeners(criteria)
	}

	private setCriteriaListeners(criteria) {
		$(criteria.dom.delete).on('click', () => {
			this.removeCriteria(criteria);
		});

		$(criteria.dom.right).on('click', () => {
			let idx = criteria.s.index;
			let group = new Group(this.s.dt, criteria.s.index, true);
			group.addCriteria(criteria);

			this.s.criteria[idx].criteria = group;
			this.s.criteria[idx].type = 'group'

			$(this.dom.container).empty();
			$(this.dom.container).append(this.dom.logic).append(this.dom.add);

			$(group.dom.container).on('dtsb-destroy', () => {
				this.removeCriteria(group);
			});

			$(group.dom.container).on('dtsb-dropCriteria', () => {
				let toDrop = group.s.toDrop;
				let length = this.s.criteria.length;
				toDrop.s.index = length;
				toDrop.removeLeft();
				this.addCriteria(toDrop);

				$(this.dom.container).empty();
				$(this.dom.container).append(this.dom.logic).append(this.dom.add);

				for (let opt of this.s.criteria) {
					$(opt.criteria.dom.container).insertBefore(this.dom.add);
				}
			});

			for (let opt of this.s.criteria) {
				$(opt.criteria.dom.container).insertBefore(this.dom.add);
			}
		});

		$(criteria.dom.left).on('click', () => {
			this.s.toDrop = new Criteria(undefined, this.s.dt, criteria.s.index);
			this.s.toDrop.s = criteria.s;
			this.s.toDrop.c = criteria.c;
			this.s.toDrop.classes = criteria.classes;
			$(this.dom.container).trigger('dtsb-dropCriteria');
			this.removeCriteria(criteria);
			$(document).trigger('dtsb-redrawContents');
		});
	}

	private removeCriteria(criteria) {
		if (this.s.criteria.length === 1 && this.s.isChild) {
			this.destroy();
		}
		else {
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
}
