describe('searchBuilder - options - language.searchBuilder.left', function() {
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
			$('.dtsb-right:eq(0)').click();

			expect($('.dtsb-left').text()).toBe('<');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						left: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			$('.dtsb-add').click();
			$('.dtsb-right:eq(0)').click();

			expect($('.dtsb-left').text()).toBe('unit test');
		});
	});
});
