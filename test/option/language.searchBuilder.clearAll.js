describe('searchBuilder - options - language.searchBuilder.clearAll', function() {
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

			expect($('.dtsb-clearAll').text()).toBe('Clear All');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						clearAll: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			
			expect($('.dtsb-clearAll').text()).toBe('unit test');
		});
	});
});
