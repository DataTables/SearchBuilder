describe('searchBuilder - options - columnDefs.searchBuilder.defaultCondition', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Check the defaults', function () {
		dt.html('basic');
		it('No option selected', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('change');

			expect($('.dtsb-condition').val()).toBe(null);
		});

	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Set with a number', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [{
					targets: 2,
					searchBuilder: {
						defaultCondition: 1
					}
				}]
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('change');

			expect($('.dtsb-condition').val()).toBe('=');
		});
		it('... other columns unaffected', function () {
			$('.dtsb-data').val(1);
			$('.dtsb-data').trigger('change');

			expect($('.dtsb-condition').val()).toBe(null);
		});

		dt.html('basic');
		it('Set with a string', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [{
					targets: 2,
					searchBuilder: {
						defaultCondition: '!='
					}
				}]
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('change');

			expect($('.dtsb-condition').val()).toBe('!=');
		});
		it('... other columns unaffected', function () {
			$('.dtsb-data').val(1);
			$('.dtsb-data').trigger('change');

			expect($('.dtsb-condition').val()).toBe(null);
		});
	});
});
