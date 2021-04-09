describe('searchBuilder - general tests', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Tests with rendered data', function () {
		dt.html('basic');
		it('With columns.render', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function (data) {
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
		it('With columns.render - just filter - equals', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function (data, type) {
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
		it('With columns.render - just filter - contains', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function (data, type) {
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

	describe('General usage -add and remove conditions', function () {
		dt.html('basic');
		it('Add a single condition', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [
					{
						targets: 2,
						render: function (data) {
							return 'test ' + data;
						}
					}
				]
			});
			$('.dtsb-group button').click();
			expect($('.dtsb-data').length).toBe(1);
		});
		it('... removing that conditions removes everything', function () {
			$('.dtsb-delete').click();
			expect($('.dtsb-data').length).toBe(0);
		});
		it('... add another', function () {
			$('.dtsb-group button').click();
			expect($('.dtsb-data').length).toBe(1);
		});
		it('... removing group removes everything', function () {
			$('.dtsb-clearGroup').click();
			expect($('.dtsb-data').length).toBe(0);
		});
		it('... add another', function () {
			$('.dtsb-group button').click();
			expect($('.dtsb-data').length).toBe(1);
		});
		it('... clearAll removes everything', function () {
			$('.dtsb-clearAll').click();
			expect($('.dtsb-data').length).toBe(0);
		});
	});

	describe('General usage - simple tests for strings', function () {
		dt.html('basic');
		it('Add a single condition - equals', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();

			// Data
			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('input');

			// condition
			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			// value
			$('.dtsb-value').val('San Francisco');
			$('.dtsb-value').trigger('input');

			expect($('tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Add a single condition - ends with', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();

			// Data
			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('input');

			// condition
			$('.dtsb-condition').val('ends');
			$('.dtsb-condition').trigger('input');

			// value
			$('input.dtsb-value').val('Londo');
			$('input.dtsb-value').trigger('input');

			expect($('tbody tr').text()).toBe('No matching records found');
		});
		it('... and give values that will match', function () {
			// value
			$('input.dtsb-value').val('don');
			$('input.dtsb-value').trigger('input');

			expect($('tbody tr td:eq(0)').text()).toBe('Angelica Ramos');
		});

		// 	dt.html('basic');
		// 	it('Add a single condition - starts with', function () {
		// 		table = $('#example').DataTable({
		// 			dom: 'Qlfrtip'
		// 		});

		// 		$('.dtsb-group button').click();

		// 		// Data
		// 		$('.dtsb-data').val(2);
		// 		$('.dtsb-data').trigger('input');

		// 		// condition
		// 		$('.dtsb-condition').val('starts');
		// 		$('.dtsb-condition').trigger('input');

		// 		// value
		// 		$('input.dtsb-value').val('ondon');
		// 		$('input.dtsb-value').trigger('input');

		// 		expect($('tbody tr').text()).toBe('No matching records found');
		// 	});
		// 	it('... and give values that will match', function () {
		// 		// value
		// 		$('input.dtsb-value').val('Londo');
		// 		$('input.dtsb-value').trigger('input');

		// 		expect($('tbody tr td:eq(0)').text()).toBe('Angelica Ramos');
		// 	});
	});

	describe('General usage - simple tests for number', function () {
		dt.html('empty');
		it('Add a single condition - equals', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			table.rows
				.add([
					['a', 'b', 'c', '0', '', ''],
					['b', 'b', 'c', '3', '', ''],
					['c', 'b', 'c', '-4', '', '']
				])
				.draw();
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');
			// condition
			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');
			// value
			$('.dtsb-value').val('-4');
			$('.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('c');
			expect($('tbody tr').length).toBe(1);
		});
		dt.html('empty');
		it('Add a single condition - between', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			table.rows
				.add([
					['a', 'b', 'c', '0', '', ''],
					['b', 'b', 'c', '3', '', ''],
					['c', 'b', 'c', '-4', '', '']
				])
				.draw();
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');
			// condition
			$('.dtsb-condition').val('between');
			$('.dtsb-condition').trigger('input');
			// value
			$('input.dtsb-value:eq(0)').val('-5');
			$('input.dtsb-value:eq(1)').val('-2');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('c');
		});
		dt.html('empty');
		it('Add a single condition - between for %', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			table.rows
				.add([
					['a', 'b', 'c', '0%', '', ''],
					['b', 'b', 'c', '3%', '', ''],
					['c', 'b', 'c', '-4%', '', '']
				])
				.draw();
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');
			// condition
			$('.dtsb-condition').val('between');
			$('.dtsb-condition').trigger('input');
			// value
			$('input.dtsb-value:eq(0)').val('-5');
			$('input.dtsb-value:eq(1)').val('-2');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('c');
		});
		dt.html('empty');
		it('Add a single condition - greater than', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			table.rows
				.add([
					['a', 'b', 'c', '0', '', ''],
					['b', 'b', 'c', '3', '', ''],
					['c', 'b', 'c', '-4', '', '']
				])
				.draw();
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');
			// condition
			$('.dtsb-condition').val('>');
			$('.dtsb-condition').trigger('input');
			// value
			$('input.dtsb-value:eq(0)').val('-5');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('a');
		});
		it('... less values', function () {
			// value
			$('input.dtsb-value:eq(0)').val('2');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('b');
		});
		dt.html('empty');
		it('Add a single condition - less than', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			table.rows
				.add([
					['a', 'b', 'c', '0', '', ''],
					['b', 'b', 'c', '3', '', ''],
					['c', 'b', 'c', '-4', '', '']
				])
				.draw();
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');
			// condition
			$('.dtsb-condition').val('<');
			$('.dtsb-condition').trigger('input');
			// value
			$('input.dtsb-value:eq(0)').val('2');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('a');
		});
		it('... less values', function () {
			// value
			$('input.dtsb-value:eq(0)').val('-3');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('c');
		});
	});
});
