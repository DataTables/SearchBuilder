/*! Bulma ui integration for DataTables' SearchBuilder
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

$.extend(true, DataTable.SearchBuilder.classes, {
	clearAll: 'button dtsb-clearAll'
});

$.extend(true, DataTable.Group.classes, {
	add: 'button dtsb-add',
	clearGroup: 'button dtsb-clearGroup',
	logic: 'button dtsb-logic',
	search: 'button dtsb-search',
});

$.extend(true, DataTable.Criteria.classes, {
	container: 'dtsb-criteria',
	delete: 'button dtsb-delete',
	left: 'button dtsb-left',
	right: 'button dtsb-right',
	input: 'input dtsb-input'
});
