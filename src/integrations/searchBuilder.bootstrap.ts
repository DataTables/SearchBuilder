/*! SearchBuilder Bootstrap 3 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable from 'datatables.net';

Object.assign(DataTable.SearchBuilder.classes, {
	clearAll: 'btn btn-default dtsb-clearAll'
});

Object.assign(DataTable.Group.classes, {
	add: 'btn btn-default dtsb-add',
	clearGroup: 'btn btn-default dtsb-clearGroup',
	logic: 'btn btn-default dtsb-logic',
	search: 'btn btn-default dtsb-search'
});

Object.assign(DataTable.Criteria.classes, {
	condition: 'form-control dtsb-condition',
	data: 'form-control dtsb-data',
	delete: 'btn btn-default dtsb-delete',
	left: 'btn btn-default dtsb-left',
	right: 'btn btn-default dtsb-right',
	value: 'form-control dtsb-value'
});
