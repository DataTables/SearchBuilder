/*! SearchBuilder Bootstrap 5 styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

import DataTable from 'datatables.net';

Object.assign(DataTable.SearchBuilder.classes, {
	clearAll: 'btn btn-secondary dtsb-clearAll'
});

Object.assign(DataTable.Group.classes, {
	add: 'btn btn-secondary dtsb-add',
	clearGroup: 'btn btn-secondary dtsb-clearGroup',
	logic: 'btn btn-secondary dtsb-logic',
	search: 'btn btn-secondary dtsb-search'
});

Object.assign(DataTable.Criteria.classes, {
	condition: 'form-select dtsb-condition',
	data: 'dtsb-data form-select',
	delete: 'btn btn-secondary dtsb-delete',
	input: 'form-control dtsb-input',
	left: 'btn btn-secondary dtsb-left',
	right: 'btn btn-secondary dtsb-right',
	select: 'form-select',
	value: 'dtsb-value'
});
