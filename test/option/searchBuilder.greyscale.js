describe('searchBuilder - options - searchBuilder.greyscale', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No greyscale by default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data').hasClass('dtsb-greyscale')).toBe(false);
		});

		dt.html('basic');
		it('Can choose greyscale', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					greyscale: true
				}
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data').hasClass('dtsb-greyscale')).toBe(true);
		});
	});
});
