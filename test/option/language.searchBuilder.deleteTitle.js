describe('searchBuilder - options - language.searchBuilder.deleteTitle', function() {
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

			expect($('.dtsb-delete').attr('title')).toBe('Delete filtering rule');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						deleteTitle: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			
			expect($('.dtsb-delete').attr('title')).toBe('unit test');
		});
	});
});
