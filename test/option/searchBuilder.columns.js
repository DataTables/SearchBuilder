describe('searchBuilder - options - searchBuilder.columns', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('All columns available by default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data').text()).toBe('DataNamePositionOfficeAgeStart dateSalary');
		});

		dt.html('basic');
		it('Integer', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					columns: 1
				}
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data').text()).toBe('DataPosition');
		});

		dt.html('basic');
		it('Array', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					columns: [1, 3, 5]
				}
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data').text()).toBe('DataPositionAgeSalary');
		});

		dt.html('basic');
		it('jQuery', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					columns: ':not(:first-child)'
				}
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data').text()).toBe('DataPositionOfficeAgeStart dateSalary');
		});
	});
});
