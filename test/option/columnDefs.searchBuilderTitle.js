describe('searchBuilder - options - columnDefs.searchBuilderTitle', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Set title', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data option:nth-child(2)').text()).toBe('Name');
		});

		dt.html('basic');
		it('Set title', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [{
					targets: 0, searchBuilderTitle: 'test'
				}]
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data option:nth-child(2)').text()).toBe('test');
		});

		dt.html('basic');
		it('Set title with HTML', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [{
					targets: 0, searchBuilderTitle: '<b>test<b>'
				}]
			});

			$('.dtsb-group button').click();
			expect($('.dtsb-data option:nth-child(2)').text()).toBe('test');
			expect($('.dtsb-data option:nth-child(2)').html()).toBe('test');
		});
	});
});
