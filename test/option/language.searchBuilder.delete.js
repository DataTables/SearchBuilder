describe('searchBuilder - options - language.searchBuilder.delete', function() {
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

			expect($('.dtsb-delete').html()).toBe($('<button>&times</button>').html());
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						delete: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			
			expect($('.dtsb-delete').html()).toBe('unit test');
		});
	});
});
