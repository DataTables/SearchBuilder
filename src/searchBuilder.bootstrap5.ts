/*! Bootstrap 5 ui integration for DataTables' SearchBuilder
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
	clearAll: 'btn btn-light dtsb-clearAll'
});

$.extend(true, DataTable.Group.classes, {
	add: 'btn btn-light dtsb-add',
	clearGroup: 'btn btn-light dtsb-clearGroup',
	logic: 'btn btn-light dtsb-logic'
});

$.extend(true, DataTable.Criteria.classes, {
	condition: 'form-select dtsb-condition',
	data: 'dtsb-data form-select',
	delete: 'btn btn-light dtsb-delete',
	input: 'form-control dtsb-input',
	left: 'btn btn-light dtsb-left',
	right: 'btn btn-light dtsb-right',
	select: 'form-select',
	value: 'dtsb-value',
});

return DataTable.searchPanes;
}));
