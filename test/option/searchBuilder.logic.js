describe('searchBuilder - options - searchBuilder.logic', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('AND by default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-logic').text()).toBe('And');
		});

		dt.html('basic');
		it('Can choose OR', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					logic: 'OR'
				}
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-logic').text()).toBe('Or');
		});
	});
});
