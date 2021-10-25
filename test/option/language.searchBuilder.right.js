describe('searchBuilder - options - language.searchBuilder.right', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();
			$('.dtsb-add').click();

			expect($('.dtsb-right:eq(0)').text()).toBe('>');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						right: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			$('.dtsb-add').click();

			expect($('.dtsb-right:eq(0)').text()).toBe('unit test');
		});
	});
});
