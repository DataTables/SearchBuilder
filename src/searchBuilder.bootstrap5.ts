/*! Bootstrap 5 ui integration for DataTables' SearchBuilder
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

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
