describe('searchBuilder - options - searchBuilder.columns', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Tests with rendered data', function() {
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
				]
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			$('.dtsb-value').val('test San Francisco');
			$('.dtsb-value').trigger('input');

			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('With columns.render - just filter - equals', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function(data, type) {
							return type === 'filter' ? 'test ' + data : data;
						}
					}
				]
			});

			$('.dtsb-group button').click();

			// Data
			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('input');

			// condition
			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			// value
			$('.dtsb-value').val('test San Francisco');
			$('.dtsb-value').trigger('input');

			// displays the 'display' option
			expect($('.dtsb-value option:selected').text()).toBe('San Francisco');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('With columns.render - just filter - contains', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function(data, type) {
							return type === 'filter' ? 'test ' + data : data;
						}
					}
				]
			});

			$('.dtsb-group button').click();

			// Data
			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('input');

			// condition
			$('.dtsb-condition').val('contains');
			$('.dtsb-condition').trigger('input');

			// value
			$('input.dtsb-value').val('test San');
			$('input.dtsb-value').trigger('input');

			// displays the 'display' option
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
	});

	describe('General usage', function() {
		dt.html('basic');
		it('Add a single condition', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function(data) {
							return 'test ' + data;
						}
					}
				]
			});
			$('.dtsb-group button').click();
			expect($('.dtsb-data').length).toBe(1);
		});
		it('... removing that conditions removes everything', function() {
			$('.dtsb-delete').click();
			expect($('.dtsb-data').length).toBe(0);
		});
		it('... add another', function() {
			$('.dtsb-group button').click();
			expect($('.dtsb-data').length).toBe(1);
		});
		it('... removing group removes everything', function() {
			$('.dtsb-clearGroup').click();
			expect($('.dtsb-data').length).toBe(0);
		});
		it('... add another', function() {
			$('.dtsb-group button').click();
			expect($('.dtsb-data').length).toBe(1);
		});
		it('... clearAll removes everything', function() {
			$('.dtsb-clearAll').click();
			expect($('.dtsb-data').length).toBe(0);
		});
	});
});
