/*! JQuery ui ui integration for DataTables' SearchBuilder
 * © SpryMedia Ltd - datatables.net/license
 */

declare var DataTable: any;

Object.assign(DataTable.SearchBuilder.classes, {
	clearAll: 'ui-button ui-corner-all ui-widget dtsb-clearAll'
});

Object.assign(DataTable.Group.classes, {
	add: 'ui-button ui-corner-all ui-widget dtsb-add',
	clearGroup: 'ui-button ui-corner-all ui-widget dtsb-clearGroup',
	logic: 'ui-button ui-corner-all ui-widget dtsb-logic',
	search: 'ui-button ui-corner-all ui-widget dtsb-search'
});

Object.assign(DataTable.Criteria.classes, {
	condition:
		'ui-selectmenu-button ui-button ui-widget ui-selectmenu-button-closed ui-corner-all dtsb-condition',
	data: 'ui-selectmenu-button ui-button ui-widget ui-selectmenu-button-closed ui-corner-all dtsb-data',
	delete: 'ui-button ui-corner-all ui-widget dtsb-delete',
	left: 'ui-button ui-corner-all ui-widget dtsb-left',
	right: 'ui-button ui-corner-all ui-widget dtsb-right',
	value: 'ui-selectmenu-button ui-button ui-widget ui-selectmenu-button-closed ui-corner-all dtsb-value'
});
