describe('searchBuilder - options - searchBuilder.preDefined', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('With columns.render', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				columnDefs: [
					{
						targets: 2,
						render: function(data) {
							return 'test ' + data;
						}
					}
				],
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: '!=',
								data: 'Office',
								value: ['test London']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('.dtsb-criteria').length).toBe(1);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
	});
});
