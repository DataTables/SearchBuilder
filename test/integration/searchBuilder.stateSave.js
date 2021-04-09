describe('searchBuilder - integrations - stateSave', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Can filter columns', function() {
			table = $('#example').DataTable({
				dom: 'Qlftip',
				stateSave: true
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			$('.dtsb-value').val('San Francisco');
			$('.dtsb-value').trigger('input');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... filter remains when loaded', function() {
			table = $('#example').DataTable({
				dom: 'Qlftip',
				destroy: true,
				stateSave: true
			});

			expect($('.dtsb-data').val()).toBe('2');
			expect($('.dtsb-condition').val()).toBe('=');
			expect($('.dtsb-value').val()).toBe('San Francisco');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... filter remains when loaded again', function() {
			table = $('#example').DataTable({
				dom: 'Qlftip',
				destroy: true,
				stateSave: true
			});

			expect($('.dtsb-data').val()).toBe('2');
			expect($('.dtsb-condition').val()).toBe('=');
			expect($('.dtsb-value').val()).toBe('San Francisco');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Tidy up', function() {
			table.state.clear();
		});
	});
});
