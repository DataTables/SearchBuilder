describe('searchBuilder - options - language.searchBuilder.logicAnd', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();

			expect($('.dtsb-logic').text()).toBe('And');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						logicAnd: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			
			expect($('.dtsb-logic').text()).toBe('unit test');
		});
	});
});
