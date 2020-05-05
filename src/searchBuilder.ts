let $;
let DataTable;

/**
 * Sets the value of jQuery for use in the file
 * @param jq the instance of jQuery to be set
 */
export function setJQuery(jq) {
	$ = jq;
	DataTable = jq.fn.DataTable;
}

import Group from './group';

/**
 * SearchBuilder class for DataTables.
 * Allows for complex search queries to be constructed and implemented on a DataTable
 */
export default class SearchBuilder {
	private static version = '0.0.1';

	private static classes = {
		button: 'dtsb-button',
		clearAll: 'dtsb-clearAll',
		container: 'dtsb-searchBuilder',
		inputButton: 'dtsb-iptbtn',
		roundButton: 'dtsb-rndbtn',
		title: 'dtsb-title',
		titleRow: 'dtsb-titleRow'
	};

	private static defaults = {

	};

	public classes;
	public dom;
	public c;
	public s;

	constructor(builderSettings, opts) {
		// Check that the required version of DataTables is included
		if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
			throw new Error('SearchBuilder requires DataTables 1.10 or newer');
		}

		let table = new DataTable.Api(builderSettings);
		this.classes = $.extend(true, {}, SearchBuilder.classes);

		// Get options from user
		this.c = $.extend(true, {}, SearchBuilder.defaults, opts);

		this.dom = {
			clearAll: $('<button type="button">' + table.i18n('searchBuilder.clearAll', 'Clear All') + '</button>')
				.addClass(this.classes.clearAll)
				.addClass(this.classes.button),
			container: $('<div/>').addClass(this.classes.container),
			searchBuilder: $('<div/>').addClass(this.classes.builder),
			title: $('<div/>').addClass(this.classes.title),
			titleRow: $('<div/>').addClass(this.classes.titleRow),
			wrapper: $('<div/>'),
		};

		this.s = {
			dt: table,
			opts,
			topGroup: undefined
		};

		if (table.settings()[0]._searchBuilder !== undefined) {
			return;
		}

		table.settings()[0]._searchBuilder = this;

		if (this.s.dt.settings()[0]._bInitComplete) {
			this._setUp();
		}
		else {
			table.one('init.dt', (settings) => {
				this._setUp();
			});
		}
	}

	/**
	 * Getter for the node of the container for the searchBuilder
	 * @returns JQuery<HTMLElement> the node of the container
	 */
	public getNode(): JQuery<HTMLElement> {
		return this.dom.container;
	}

	/**
	 * Set's up the SearchBuilder
	 */
	private _setUp(): void {
		this.s.topGroup = new Group(this.s.dt, this.c);

		$(this.dom.clearAll).on('click', () => {
			this.s.topGroup = new Group(this.s.dt, this.s.opts);
			this._build();
			this.s.dt.draw();
		});

		this.s.dt.on('stateSaveParams', (e, settings, data) => {
			data.searchBuilder = this._saveDetails();
		});

		this._build();

		let loadedState = this.s.dt.state.loaded();

		if (loadedState !== null && loadedState.searchBuilder !== undefined) {
			this.s.topGroup.rebuild(loadedState.searchBuilder);
			$(document).trigger('dtsb-redrawContents');
			this.s.dt.draw();
		}
	}

	/**
	 * Builds all of the dom elements together
	 */
	private _build(): void {
		$(this.dom.container).empty();

		$(this.dom.title).text('SearchBuilder');

		$(this.dom.titleRow).append(this.dom.title);
		$(this.dom.titleRow).append(this.dom.clearAll);
		$(this.dom.container).append(this.dom.titleRow);
		this.dom.topGroup = this.s.topGroup.getNode();
		$(this.dom.container).append(this.dom.topGroup);

		this.s.search = (settings, searchData, dataIndex, origData) => {
			return this.s.topGroup.search(searchData);
		};

		$.fn.dataTable.ext.search.push(this.s.search);
		$.fn.DataTable.Api.registerPlural('columns().type()', 'column().type()', function(selector, opts) {
			return this.iterator('column', function(settings, column) {
				return settings.aoColumns[column].sType;
			}, 1);
		});
	}

	private _saveDetails() {
		return this.s.topGroup.getDetails();
	}
}
