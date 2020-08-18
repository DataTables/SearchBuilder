describe('searchBuilder - API - searchBuilder.rebuild()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			expect(typeof table.searchBuilder.rebuild).toBe('function');
		});
		it('Getter returns data source property', function() {
			expect(table.searchBuilder.rebuild() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No search present', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			table.searchBuilder.rebuild({});

			expect($('.dtsb-criteria').length).toBe(0);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Partial search', function() {
			table.searchBuilder.rebuild({ criteria: [{ data: 'Office', value: [] }], logic: 'AND' });

			expect($('.dtsb-criteria').length).toBe(1);
			expect($('.dtsb-data option:selected').text()).toBe('Office');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
		it('Full search', function() {
			table.searchBuilder.rebuild({
				criteria: [{ condition: '=', data: 'Office', value: ['San Francisco'] }],
				logic: 'AND'
			});

			expect($('.dtsb-criteria').length).toBe(1);
			expect($('.dtsb-data option:selected').text()).toBe('Office');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Second condition', function() {
			table.searchBuilder.rebuild({
				criteria: [
					{ condition: '=', data: 'Office', value: ['San Francisco'] },
					{ condition: '>', data: 'Age', value: [60] }
				],
				logic: 'AND'
			});

			expect($('.dtsb-criteria').length).toBe(2);
			expect($('.dtsb-data:eq(0) option:selected').text()).toBe('Office');
			expect($('.dtsb-data:eq(1) option:selected').text()).toBe('Age');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('tbody tr').length).toBe(2);
		});
	});
});
