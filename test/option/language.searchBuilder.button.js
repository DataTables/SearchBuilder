describe('searchBuilder - options - language.searchBuilder.button', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'searchbuilder', 'datetime'],
		css: ['datatables', 'buttons', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				buttons: ['searchBuilder'],
				dom: 'Bfrtip'
			});

			expect($('.dt-button').text()).toBe('Search Builder');
		});
		it('... one filter once there is a filter applied', function() {
			$('.dt-button').click();

			table.searchBuilder.rebuild({
				criteria: [{ condition: '=', data: 'Office', value: ['San Francisco'] }],
				logic: 'AND'
			});

			expect($('.dt-button').text()).toBe('Search Builder (1)');
		});
		it('... two filters', function() {
			table.searchBuilder.rebuild({
				criteria: [
					{ condition: '=', data: 'Office', value: ['San Francisco'] },
					{ condition: 'starts', data: 'Name', value: ['F'] }
			],
				logic: 'AND'
			});

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

			expect($('.dt-button').text()).toBe('unit test');
		});
		it('... one filter once SB button pressed', function() {
			$('.dt-button').click();
			expect($('.dt-button').text()).toBe('unit test');
		});
		it('... two filters once add button pressed', function() {
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

			expect($('.dt-button').text()).toBe('test none');
		});
		it('... one filter on filter applied', function() {
			$('.dt-button').click();

			table.searchBuilder.rebuild({
				criteria: [{ condition: '=', data: 'Office', value: ['San Francisco'] }],
				logic: 'AND'
			});

			expect($('.dt-button').text()).toBe('test one');
		});
		it('... two filters', function() {
			table.searchBuilder.rebuild({
				criteria: [
					{ condition: '=', data: 'Office', value: ['San Francisco'] },
					{ condition: 'starts', data: 'Name', value: ['F'] }
			],
				logic: 'AND'
			});

			expect($('.dt-button').text()).toBe('test 2');
		});

		dt.html('basic');
		it('Pressing SB button only adds criteria the first time', function() {
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

			expect($('.dt-button').text()).toBe('test none');
		});
		it('... one filter on filter applied', function() {
			$('.dt-button').click();

			table.searchBuilder.rebuild({
				criteria: [{ condition: '=', data: 'Office', value: ['San Francisco'] }],
				logic: 'AND'
			});

			expect($('.dt-button').text()).toBe('test one');
		});
		it('... one filter when pressed again', function() {
			$('.dt-button-background').click();
			$('.dt-button').click();
			expect($('.dt-button').text()).toBe('test one');
		});
	});
});
