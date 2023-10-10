/*! Bootstrap ui integration for DataTables' SearchBuilder
 * © SpryMedia Ltd - datatables.net/license
*/

declare var DataTable: any;

$.extend(true, DataTable.SearchBuilder.classes, {
	clearAll: 'btn btn-default dtsb-clearAll'
});

$.extend(true, DataTable.Group.classes, {
	add: 'btn btn-default dtsb-add',
	clearGroup: 'btn btn-default dtsb-clearGroup',
	logic: 'btn btn-default dtsb-logic',
});

$.extend(true, DataTable.Criteria.classes, {
	condition: 'form-control dtsb-condition',
	data: 'form-control dtsb-data',
	delete: 'btn btn-default dtsb-delete',
	left: 'btn btn-default dtsb-left',
	right: 'btn btn-default dtsb-right',
	search: 'btn btn-default dtsb-search',
	value: 'form-control dtsb-value',
});
