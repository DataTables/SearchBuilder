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

		$(this.dom.container).remove();

		$(this.dom.container).trigger('dtsb-destroy');
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
		$(this.dom.add).on('click', () => {
			this.addCriteria();
		})

		$(this.dom.logic.on('click', () => {
			this.toggleLogic();
		}))
		$(this.dom.add).text('ADD');
		$(this.dom.logic).text('Set Logic');
		$(this.dom.container).append(this.dom.logic);
		$(this.dom.container).append(this.dom.add);
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
			index
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

		$(criteria.dom.delete).on('click', () => {
			for (let i = 0; i < this.s.criteria.length; i++) {
				if (this.s.criteria[i].index === crit.s.index) {
					this.s.criteria.splice(i, 1);
					break;
				}
			}

			for (let i = 0; i < this.s.criteria.length; i++) {
				this.s.criteria[i].index = i;
				this.s.criteria[i].criteria.s.index = i;
			}

			if (this.s.isChild && this.s.criteria.length === 0) {
				this.destroy();
			}
		});

		$(criteria.dom.right).on('click', () => {
			let idx = criteria.s.index;
			let group = new Group(this.s.dt, criteria.s.index, true);
			group.addCriteria(criteria);

			this.s.criteria[idx].criteria.destroy();
			this.s.criteria[idx].criteria = group;

			$(this.dom.container).empty();
			$(this.dom.container).append(this.dom.logic).append(this.dom.add);

			for (let opt of this.s.criteria) {
				$(opt.criteria.dom.container).insertBefore(this.dom.add);
			}

			$(group.dom.container).on('dtsb-destroy', () => {
				for (let i = 0; i < this.s.criteria.length; i++) {
					if (this.s.criteria[i].index === group.s.index) {
						this.s.criteria.splice(i, 1);
						break;
					}
				}

				for (let i = 0; i < this.s.criteria.length; i++) {
					this.s.criteria[i].index = i;
					this.s.criteria[i].criteria.s.index = i;
				}

				if (!this.s.isChild && this.s.criteria.length === 0) {
					this.destroy();
				}
			});
		});
	}
}
