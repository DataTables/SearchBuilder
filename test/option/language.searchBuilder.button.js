describe('searchBuilder - options - language.searchBuilder.button', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'searchbuilder'],
		css: ['datatables', 'buttons', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				buttons: ['searchBuilder'],
				dom: 'Bfrtip'
			});

			expect($('.dt-buttons').text()).toBe('SearchBuilder ');
		});
		it('... one filter', function() {
			$('.dt-button').click();
			$('.dtsb-add').click();
			expect($('.dt-button').text()).toBe('Search Builder (1)');
		});
		it('... two filters', function() {
			$('.dtsb-add').click();
			expect($('.dt-button').text()).toBe('Search Builder (2)');
		});

		dt.html('basic');
		it('Fixed string', function() {
			table = $('#example').DataTable({
				buttons: ['searchBuilder'],
				dom: 'Bfrtip',
				language: {
					searchBuilder: {
						button: 'unit test'
					}
				}
			});

			expect($('.dt-buttons').text()).toBe('unit test ');
		});
		it('... one filter', function() {
			$('.dt-button').click();
			$('.dtsb-add').click();
			expect($('.dt-button').text()).toBe('unit test');
		});
		it('... two filters', function() {
			$('.dtsb-add').click();
			expect($('.dt-button').text()).toBe('unit test');
		});

		dt.html('basic');
		it('Conditional values', function() {
			table = $('#example').DataTable({
				buttons: ['searchBuilder'],
				dom: 'Bfrtip',
				language: {
					searchBuilder: {
						button: {
							0: 'test none',
							1: 'test one',
							_: 'test %d'
						}
					}
				}
			});

			expect($('.dt-buttons').text()).toBe('test none ');
		});
		it('... one filter', function() {
			$('.dt-button').click();
			$('.dtsb-add').click();
			expect($('.dt-button').text()).toBe('test one');
		});
		it('... two filters', function() {
			$('.dtsb-add').click();
			expect($('.dt-button').text()).toBe('test 2');
		});
	});
});
