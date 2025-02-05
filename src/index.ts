/*! SearchBuilder 1.8.2
 * ©SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     SearchBuilder
 * @description End user complex search builder for DataTables
 * @version     1.8.2
 * @author      SpryMedia Ltd
 * @copyright   Copyright SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 * MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/// <reference path = '../node_modules/@types/jquery/index.d.ts'

import Criteria, {setJQuery as criteriaJQuery} from './criteria';
import Group, {setJQuery as groupJQuery} from './group';
import SearchBuilder, {setJQuery as searchBuilderJQuery} from './searchBuilder';

searchBuilderJQuery($);
groupJQuery($);
criteriaJQuery($);

// Work around until we sort out the typing
declare var DataTable: any;
const dataTable: any = $.fn.dataTable;

// eslint-disable-next-line no-extra-parens
DataTable.SearchBuilder = SearchBuilder;
// eslint-disable-next-line no-extra-parens
dataTable.SearchBuilder = SearchBuilder;
// eslint-disable-next-line no-extra-parens
DataTable.Group = Group;
// eslint-disable-next-line no-extra-parens
dataTable.Group = Group;
// eslint-disable-next-line no-extra-parens
DataTable.Criteria = Criteria;
// eslint-disable-next-line no-extra-parens
dataTable.Criteria = Criteria;

// eslint-disable-next-line no-extra-parens
let apiRegister = DataTable.Api.register;

// Set up object for plugins
DataTable.ext.searchBuilder = {
	conditions: {}
};

DataTable.ext.buttons.searchBuilder = {
	action(e, dt, node, config) {
		this.popover(config._searchBuilder.getNode(), {
			align: 'container',
			span: 'container'
		});

		let topGroup = config._searchBuilder.s.topGroup;

		// Need to redraw the contents to calculate the correct positions for the elements
		if (topGroup !== undefined) {
			topGroup.dom.container.trigger('dtsb-redrawContents-noDraw');
		}
		if (topGroup.s.criteria.length === 0) {
			$('.'+($.fn as any).dataTable.Group.classes.add.replace(/ /g, '.')).click();
		}
	},
	config: {},
	init(dt, node, config) {
		let that = this;

		let sb = new DataTable.SearchBuilder(
			dt,
			config.config
		);

		dt.on('draw', function () {
			let count = sb.s.topGroup
				? sb.s.topGroup.count()
				: 0;

			that.text(
				dt.i18n('searchBuilder.button', sb.c.i18n.button, count)
			);
		});

		that.text(
			config.text || dt.i18n('searchBuilder.button', sb.c.i18n.button, 0)
		);
		config._searchBuilder = sb;
	},
	text: null,
};

apiRegister('searchBuilder.getDetails()', function(deFormatDates=false) {
	let ctx = this.context[0];

	// If SearchBuilder has not been initialised on this instance then return
	return ctx._searchBuilder ?
		ctx._searchBuilder.getDetails(deFormatDates) :
		null;
});

apiRegister('searchBuilder.rebuild()', function(details, redraw = true) {
	let ctx = this.context[0];

	// If SearchBuilder has not been initialised on this instance then return
	if (ctx._searchBuilder === undefined) {
		return null;
	}

	ctx._searchBuilder.rebuild(details, redraw);

	return this;
});

apiRegister('searchBuilder.container()', function() {
	let ctx = this.context[0];

	// If SearchBuilder has not been initialised on this instance then return
	return ctx._searchBuilder ?
		ctx._searchBuilder.getNode() :
		null;
});

/**
 * Init function for SearchBuilder
 *
 * @param settings the settings to be applied
 * @param options the options for SearchBuilder
 * @returns JQUERY<HTMLElement> Returns the node of the SearchBuilder
 */
function _init(settings: any, options?: any): JQuery<HTMLElement> {
	let api = new DataTable.Api(settings);
	let opts = options
		? options
		: api.init().searchBuilder || DataTable.defaults.searchBuilder;

	let searchBuilder = new SearchBuilder(api, opts);
	let node = searchBuilder.getNode();

	return node;
}

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on('preInit.dt.dtsp', function(e, settings) {
	if (e.namespace !== 'dt') {
		return;
	}

	if (settings.oInit.searchBuilder ||
		DataTable.defaults.searchBuilder
	) {
		if (!settings._searchBuilder) {
			_init(settings);
		}
	}
});

// DataTables `dom` feature option
DataTable.ext.feature.push({
	cFeature: 'Q',
	fnInit: _init,
});

// DataTables 2 layout feature
if (DataTable.feature) {
	DataTable.feature.register('searchBuilder', _init);
}
