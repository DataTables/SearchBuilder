describe('searchBuilder - options - language.searchBuilder.conditions.string', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Default', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();

			$('.dtsb-data').val(1);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			expect($('.dtsb-condition option:selected').text()).toBe('Equals');
		});

		dt.html('basic');
		it('Change Equals', function () {
			table = $('#example').DataTable({
				language: {
					searchBuilder: {
						conditions: {
							string: {
								equals: 'unit test'
							}
						}
					}
				},
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();

			$('.dtsb-data').val(1);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			expect($('.dtsb-condition option:selected').text()).toBe('unit test');
		});
	});
});
