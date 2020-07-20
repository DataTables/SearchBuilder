describe('searchBuilder - integration - ColReorder', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'colreorder'],
		css: ['datatables', 'searchbuilder', 'colreorder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Change initial order', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				colReorder: {
					order: [5, 4, 3, 2, 1, 0]
				}
			});

			$('.dtsb-add').click();

			expect($('.dtsb-data').text()).toBe('DataSalaryStart dateAgeOfficePositionName');
		});
		it('Change  order through API', function() {
			table.colReorder.move(4,0)

			$('.dtsb-add').click();

			expect($('.dtsb-data:eq(1)').text()).toBe('DataPositionSalaryStart dateAgeOfficeName');
		});

		dt.html('basic');
		it('rebuild() - Change order after rebuild', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				colReorder: true
			});

			table.searchBuilder.rebuild({
				criteria: [
					{ condition: '=', data: 'Office', dataIdx: '2', value: ['San Francisco'] },
					{ condition: '>', data: 'Age', dataIdx: '3', value: [60] }
				],
				logic: 'AND'
			});

			table.colReorder.move(3, 0);

			expect($('.dtsb-criteria').length).toBe(2);
			expect($('.dtsb-data:eq(0) option:selected').text()).toBe('Office');
			expect($('.dtsb-data:eq(1) option:selected').text()).toBe('Age');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('66');
			expect($('tbody tr').length).toBe(2);
		});
	});
});
