describe('searchBuilder - options - searchBuilder.preDefined', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Changing column title', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				columnDefs: [
					{
						targets: 2,
						title: 'Second Column'
					}
				],
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Not',
								data: 'Second Column',
								value: ['London']
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
