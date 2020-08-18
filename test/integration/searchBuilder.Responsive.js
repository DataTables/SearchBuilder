describe('searchBuilder - integrations - Responsive', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'responsive', 'searchbuilder'],
		css: ['datatables', 'responsive', 'searchbuilder']
	});

	describe('Check the behaviour', function() {
		dt.html('basic_wide');
		it('Can filter hidden columns', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				responsive: true
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(8);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			$('.dtsb-value').val('a.cox@datatables.net');
			$('.dtsb-value').trigger('input');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton');
		});
	});
});
