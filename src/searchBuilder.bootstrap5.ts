/*! Bootstrap 5 ui integration for DataTables' SearchBuilder
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

$.extend(true, DataTable.SearchBuilder.classes, {
	clearAll: 'btn btn-secondary dtsb-clearAll'
});

$.extend(true, DataTable.Group.classes, {
	add: 'btn btn-secondary dtsb-add',
	clearGroup: 'btn btn-secondary dtsb-clearGroup',
	logic: 'btn btn-secondary dtsb-logic'
});

$.extend(true, DataTable.Criteria.classes, {
	condition: 'form-select dtsb-condition',
	data: 'dtsb-data form-select',
	delete: 'btn btn-secondary dtsb-delete',
	input: 'form-control dtsb-input',
	left: 'btn btn-secondary dtsb-left',
	right: 'btn btn-secondary dtsb-right',
	select: 'form-select',
	value: 'dtsb-value',
});
