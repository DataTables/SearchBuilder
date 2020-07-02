describe('searchBuilder - options - searchBuilder.columns', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('General tests', function() {
		dt.html('basic');
		it('With columns.render', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function(data) {
							return 'test ' + data;
						}
					}
				],
			});

			$('.dtsb-group button').click();
			$('.dtsb-data').val(2);

			var clickEvent = $.Event('click');
            $('.dtsb-data').trigger('input');
			expect($('.dtsb-data').text()).toBe('DataNamePositionOfficeAgeStart dateSalary');
		});
	});
});
