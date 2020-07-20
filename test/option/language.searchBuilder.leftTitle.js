describe('searchBuilder - options - language.searchBuilder.leftTitle', function() {
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
			$('.dtsb-add').click();
			$('.dtsb-right:eq(0)').click();

			expect($('.dtsb-left').attr('title')).toBe('Outdent criteria');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						leftTitle: 'unit test'
					}
				}
			});

			$('.dtsb-add').click();
			$('.dtsb-add').click();
			$('.dtsb-right:eq(0)').click();

			expect($('.dtsb-left').attr('title')).toBe('unit test');
		});
	});
});
