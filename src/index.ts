/*! SearchBuilder 1.0.1
 * ©2020 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     SearchBuilder
 * @description End user complex search builder for DataTables
 * @version     1.0.1
 * @file        dataTables.searchBuilder.js
 * @author      SpryMedia Ltd
 * @copyright   Copyright 2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

 /// <reference path = '../node_modules/@types/jquery/index.d.ts'

// Hack to allow TypeScript to compile our UMD
declare var define: {
	(string, Function): any;
	amd: string;
};

import Criteria, {setJQuery as criteriaJQuery} from './criteria';
import Group, {setJQuery as groupJQuery} from './group';
import SearchBuilder, {setJQuery as searchBuilderJQuery} from './searchBuilder';

// DataTables extensions common UMD. Note that this allows for AMD, CommonJS
// (with window and jQuery being allowed as parameters to the returned
// function) or just default browser loading.
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net'], function($) {
			return factory($, window, document);
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		module.exports = function(root, $) {
			if (! root) {
				root = window;
			}

			if (! $ || ! $.fn.dataTable) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser - assume jQuery has already been loaded
		factory((window as any).jQuery, window, document);
	}
}(function($, window, document) {

	searchBuilderJQuery($);
	groupJQuery($);
	criteriaJQuery($);

	let DataTable = $.fn.dataTable;

	($.fn as any).dataTable.SearchBuilder = SearchBuilder;
	($.fn as any).DataTable.SearchBuilder = SearchBuilder;
	($.fn as any).dataTable.Group = Group;
	($.fn as any).DataTable.Group = Group;
	($.fn as any).dataTable.Criteria = Criteria;
	($.fn as any).DataTable.Criteria = Criteria;

	let apiRegister = ($.fn.dataTable.Api as any).register;

	// Set up object for plugins
	$.fn.dataTable.ext.searchBuilder = {
		conditions: {}
	};

	$.fn.dataTable.ext.buttons.searchBuilder = {
		action(e, dt, node, config) {
			e.stopPropagation();
			this.popover(config._searchBuilder.getNode(), {
				align: 'dt-container'
			});
		},
		config: {},
		init(dt, node, config) {
			let sb = new $.fn.dataTable.SearchBuilder(
				dt,
				$.extend(
					{
						filterChanged(count, text) {
							dt.button(node).text(text);
						},
					},
					config.config
				)
			);

			dt.button(node).text(
				config.text || dt.i18n('searchBuilder.button', sb.c.i18n.button, 0)
			);
			config._searchBuilder = sb;
		},
		text: null,
	};

	apiRegister('searchBuilder.getDetails()', function() {
		let ctx = this.context[0];

		// If SearchBuilder has not been initialised on this instance then return
		if (ctx._searchBuilder === undefined) {
			return;
		}

		return ctx._searchBuilder.getDetails();
	});

	apiRegister('searchBuilder.rebuild()', function(details) {
		let ctx = this.context[0];

		// If SearchBuilder has not been initialised on this instance then return
		if (ctx._searchBuilder === undefined) {
			return;
		}

		ctx._searchBuilder.rebuild(details);

		return this;
	});

	apiRegister('searchBuilder.container()', function() {
		let ctx = this.context[0];

		// If SearchBuilder has not been initialised on this instance then return
		if (ctx._searchBuilder === undefined) {
			return;
		}

		return ctx._searchBuilder.getNode();
	});

	/**
	 * Init function for SearchBuilder
	 * @param settings the settings to be applied
	 * @param options the options for SearchBuilder
	 * @returns JQUERY<HTMLElement> Returns the node of the SearchBuilder
	 */
	function _init(settings: any, options?: any): JQuery<HTMLElement> {
		let api = new DataTable.Api(settings);
		let opts = options
			? options
			: api.init().searchBuilder || DataTable.defaults.searchBuilder;

		let searchBuilder =  new SearchBuilder(api, opts);
		let node = searchBuilder.getNode();

		return node;
	}

	// Attach a listener to the document which listens for DataTables initialisation
	// events so we can automatically initialise
	$(document).on('preInit.dt.dtsp', function(e, settings, json) {
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
	if (DataTable.ext.features) {
		DataTable.ext.features.register('searchBuilder', _init);
	}

}));
