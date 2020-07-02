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
			// $('select.dtsb-data').click();
			// $('.dtsb-data').val(2);
			// $('.dtsb-condition').val(2);

			
			// $('.dtsb-value').val(2);
			$('select.dtsb-data>option:eq(2)').prop('selected', true);


			// TK COLIN finish this test
			// var clickEvent = $.Event('click');
            // $('.dtsb-data').trigger('input');
			// expect($('.dtsb-data').text()).toBe('DataNamePositionOfficeAgeStart dateSalary');
		});
	});
});
