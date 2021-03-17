/*! Bulma ui integration for DataTables' SearchBuilder
 * ©2016 SpryMedia Ltd - datatables.net/license
 */
// Hack to allow TypeScript to compile our UMD
declare var define: {
	(string, Function): any;
	amd: string;
};
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'datatables.net-bs5', 'datatables.net-searchbuilder'], function($) {
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
				$ = require('datatables.net-bs5')(root, $).$;
			}

			if (! $.fn.dataTable.searchBuilder) {
				require('datatables.net-searchbuilder')(root, $);
			}

			return factory($, root, root.document);
		};
	}
	else {
		// Browser
		factory(jQuery, window, document);
	}
}(function($, window, document) {
'use strict';
let DataTable = $.fn.dataTable;

$.extend(true, DataTable.SearchBuilder.classes, {
	clearAll: 'button dtsb-clearAll'
});

$.extend(true, DataTable.Group.classes, {
	add: 'button dtsb-add',
	clearGroup: 'button dtsb-clearGroup is-light',
	logic: 'button dtsb-logic is-light'
});

$.extend(true, DataTable.Criteria.classes, {
	container: 'dtsb-criteria',
	delete: 'button dtsb-delete',
	left: 'button dtsb-left',
	right: 'button dtsb-right',
});

return DataTable.searchPanes;
}));
