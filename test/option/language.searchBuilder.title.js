describe('searchBuilder - options - language.searchBuilder.title', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'searchbuilder', 'datetime'],
		css: ['datatables', 'buttons', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			expect($('.dtsb-title').text()).toBe('Custom Search Builder');
		});
		it('... one filter', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('Custom Search Builder (1)');
		});
		it('... two filters', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('Custom Search Builder (2)');
		});

		dt.html('basic');
		it('Modified - string', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						title: 'unit test'
					}
				}
			});

			expect($('.dtsb-title').text()).toBe('unit test');
		});
		it('... one filter', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('unit test');
		});

		dt.html('basic');
		it('Modified - object', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				language: {
					searchBuilder: {
						title: {
							0: 'test none',
							1: 'test one',
							_: 'test %d'
						}
					}
				}
			});

			expect($('.dtsb-title').text()).toBe('test none');
		});
		it('... one filter', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('test one');
		});
		it('... two filters', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('test 2');
		});

		dt.html('basic');
		it('Modified - object - within button', function() {
			table = $('#example').DataTable({
				buttons: ['searchBuilder'],
				dom: 'Bfrtip',
				language: {
					searchBuilder: {
						title: {
							0: 'test none',
							1: 'test one',
							_: 'test %d'
						}
					}
				}
			});

			expect($('.dt-button').text()).toBe('Search Builder');
		});
		it('... one filter on initial button press', function() {
			$('.dt-button').click();
			expect($('.dtsb-title').text()).toBe('test one');
		});
		it('... second filter needs add press filter', function() {
			$('.dt-button').click();
			expect($('.dtsb-title').text()).toBe('test one');
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('test 2');
		});
		it('... 3 filters', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('test 3');
		});
	});
});
