describe('searchBuilder - options - language.searchBuilder.leftTitle', function() {
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

			expect($('.dtsb-right:eq(0)').attr('title')).toBe('Indent criteria');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						rightTitle: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			$('.dtsb-add').click();

			expect($('.dtsb-right:eq(0)').attr('title')).toBe('unit test');
		});
	});
});
