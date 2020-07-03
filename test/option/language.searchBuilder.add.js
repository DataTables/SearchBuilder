describe('searchBuilder - options - language.searchBuilder.add', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'searchbuilder'],
		css: ['datatables', 'buttons', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			expect($('.dtsb-add').text()).toBe('Add Condition');
		});

		dt.html('basic');
		it('Modified', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						add: 'unit test'
					}
				},
			});

			expect($('.dtsb-add').text()).toBe('unit test');
		});

		dt.html('basic');
		it('Button', function() {
			table = $('#example').DataTable({
				dom: 'Blfrtip',
				language: {
					searchBuilder: {
						add: 'unit test'
					}
				},
				buttons: ['searchBuilder']
			});

			$('.dt-button').click();
			expect($('.dtsb-add').text()).toBe('unit test');
		});
	});
});
