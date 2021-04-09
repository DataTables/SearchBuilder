describe('searchBuilder - options - language.searchBuilder.conditions.number', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Default', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('>=');
			$('.dtsb-condition').trigger('input');

			expect($('.dtsb-condition option:selected').text()).toBe('Greater Than Equal To');
		});

		dt.html('basic');
		it('Change Equals', function () {
			table = $('#example').DataTable({
				language: {
					searchBuilder: {
						conditions: {
							number: {
								gte: 'unit test'
							}
						}
					}
				},
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('>=');
			$('.dtsb-condition').trigger('input');

			expect($('.dtsb-condition option:selected').text()).toBe('unit test');
		});
	});
});
