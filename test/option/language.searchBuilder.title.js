describe('searchBuilder - options - language.searchBuilder.title', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			expect($('.dtsb-title').text()).toBe('Search Builder');
		});
		it('... one filter', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('Search Builder (1)');
		});
		it('... two filters', function() {
			$('.dtsb-add').click();
			expect($('.dtsb-title').text()).toBe('Search Builder (2)');
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
						}					}
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
	});
});
