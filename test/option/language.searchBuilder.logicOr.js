describe('searchBuilder - options - language.searchBuilder.logicOr', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					logic: 'OR'
				}
			});

			$('.dtsb-add').click();

			expect($('.dtsb-logic').text()).toBe('Or');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						logicOr: 'unit test'
					}
				},
				searchBuilder: {
					logic: 'OR'
				}
			});

			$('.dtsb-add').click();

			expect($('.dtsb-logic').text()).toBe('unit test');
		});
	});
});
