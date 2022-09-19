/*! Foundation ui integration for DataTables' SearchBuilder
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

$.extend(true, DataTable.SearchBuilder.classes, {
	clearAll: 'button alert dtsb-clearAll'
});

$.extend(true, DataTable.Group.classes, {
	add: 'button dtsb-add',
	clearGroup: 'button dtsb-clearGroup',
	logic: 'button dtsb-logic',
});

$.extend(true, DataTable.Criteria.classes, {
	condition: 'form-control dtsb-condition',
	data: 'form-control dtsb-data',
	delete: 'button alert dtsb-delete',
	left: 'button dtsb-left',
	right: 'button dtsb-right',
	value: 'form-control dtsb-value',
});
