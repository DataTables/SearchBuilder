describe('searchBuilder - options - language.searchBuilder.valueJoiner', function () {
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
			$('.dtsb-data').trigger('change');

			$('.dtsb-condition').val('between');
			$('.dtsb-condition').trigger('change');

			expect($('.dtsb-joiner').text()).toBe('and');
		});

		dt.html('basic');
		it('Change Equals', function () {
			table = $('#example').DataTable({
				language: {
					searchBuilder: {
						valueJoiner: 'unit test'
					}
				},
				dom: 'Qlfrtip'
			});

			$('.dtsb-add').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('change');

			$('.dtsb-condition').val('between');
			$('.dtsb-condition').trigger('change');

			expect($('.dtsb-joiner').text()).toBe('unit test');
		});
	});
});
