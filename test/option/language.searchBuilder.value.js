describe('searchBuilder - options - language.searchBuilder.value', function() {
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
			expect($('.dtsb-value option:selected').text()).toBe('Value');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						value: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			expect($('.dtsb-value option:selected').text()).toBe('unit test');
		});
	});
});
