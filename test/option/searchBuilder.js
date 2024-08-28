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
			$('.dtsb-data').trigger('change');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('change');

			$('.dtsb-value').val('test San Francisco');
			$('.dtsb-value').trigger('change');

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
			$('.dtsb-data').trigger('change');

			// condition
			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('change');

			// value
			$('.dtsb-value').val('test San Francisco');
			$('.dtsb-value').trigger('change');

			// displays the 'display' option
			expect($('.dtsb-value option:selected').text()).toBe('San Francisco');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('With columns.render - just filter - contains', async function () {
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
			$('.dtsb-data').trigger('change');

			// condition
			$('.dtsb-condition').val('contains');
			$('.dtsb-condition').trigger('change');

			// value
			$('input.dtsb-value').val('test San');
			$('input.dtsb-value').trigger('input');

			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
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
			$('.dtsb-data').trigger('change');

			// condition
			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('change');

			// value
			$('.dtsb-value').val('San Francisco');
			$('.dtsb-value').trigger('change');

			expect($('tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Add a single condition - ends with', async function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();

			// Data
			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('change');

			// condition
			$('.dtsb-condition').val('ends');
			$('.dtsb-condition').trigger('change');

			// value
			$('input.dtsb-value').val('Londo');
			$('input.dtsb-value').trigger('input');

			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB

			expect($('tbody tr').text()).toBe('No matching records found');
		});
		it('... and give values that will match', async function () {
			// value
			$('input.dtsb-value').val('don');
			$('input.dtsb-value').trigger('input');

			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
			expect($('tbody tr td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Add a single condition - starts with', async function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();

			// Data
			$('.dtsb-data').val(2);
			$('.dtsb-data').trigger('change');

			// condition
			$('.dtsb-condition').val('starts');
			$('.dtsb-condition').trigger('change');

			// value
			$('input.dtsb-value').val('ondon');
			$('input.dtsb-value').trigger('input');

			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB

			expect($('tbody tr').text()).toBe('No matching records found');
		});
		it('... and give values that will match', async function () {
			// value
			$('input.dtsb-value').val('Londo');
			$('input.dtsb-value').trigger('input');

			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB

			expect($('tbody tr td:eq(0)').text()).toBe('Angelica Ramos');
		});
	});

	describe('General usage - diacritics tests for strings', function () {
		const KATAKANA_LETTER_TE = "\u30c6\u30e2";
		const KATAKANA_LETTER_DE = "\u30c7\u30e2"; // diacritics

		dt.html("empty");
		it('Add a single condition - starts', async function(){
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				data: [
					[KATAKANA_LETTER_TE,"","","","",""],
					[KATAKANA_LETTER_DE,"","","","",""]
				]});
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(0);
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('starts');
			$('.dtsb-condition').trigger('change');
			// value
			$('.dtsb-value').val(KATAKANA_LETTER_DE);
			$('.dtsb-value').trigger('input');
			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
			expect($('tbody tr td:eq(0)').text()).toBe(KATAKANA_LETTER_DE);
			expect($('tbody tr').length).toBe(1);
		});

		dt.html("empty");
		it('Add a single condition - not starts', async function(){
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				data: [
					[KATAKANA_LETTER_TE,"","","","",""],
					[KATAKANA_LETTER_DE,"","","","",""]
				]});
			$('.dtsb-group button').click();
			// Data
			$('.dtsb-data').val(0);
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('!starts');
			$('.dtsb-condition').trigger('change');
			// value
			$('.dtsb-value').val(KATAKANA_LETTER_DE);
			$('.dtsb-value').trigger('input');
			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
			expect($('tbody tr td:eq(0)').text()).toBe(KATAKANA_LETTER_TE);
			expect($('tbody tr').length).toBe(1);
		});
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
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('change');
			// value
			$('.dtsb-value').val('-4');
			$('.dtsb-value').trigger('change');
			expect($('tbody tr td:eq(0)').text()).toBe('c');
			expect($('tbody tr').length).toBe(1);
		});

		dt.html('empty');
		it('Add a single condition - between', async function () {
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
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('between');
			$('.dtsb-condition').trigger('change');
			// value
			$('input.dtsb-value:eq(0)').val('-5');
			$('input.dtsb-value:eq(1)').val('-2');
			$('input.dtsb-value').trigger('input');
			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
			expect($('tbody tr td:eq(0)').text()).toBe('c');
		});

		dt.html('empty');
		it('Add a single condition - between for %', async function () {
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
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('between');
			$('.dtsb-condition').trigger('change');
			// value
			$('input.dtsb-value:eq(0)').val('-5');
			$('input.dtsb-value:eq(1)').val('-2');
			$('input.dtsb-value').trigger('input');
			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
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
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('>');
			$('.dtsb-condition').trigger('change');
			// value
			$('input.dtsb-value:eq(0)').val('-5');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('a');
		});
		it('... less values', async function () {
			// value
			$('input.dtsb-value:eq(0)').val('2');
			$('input.dtsb-value').trigger('input');
			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
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
			$('.dtsb-data').trigger('change');
			// condition
			$('.dtsb-condition').val('<');
			$('.dtsb-condition').trigger('change');
			// value
			$('input.dtsb-value:eq(0)').val('2');
			$('input.dtsb-value').trigger('input');
			expect($('tbody tr td:eq(0)').text()).toBe('a');
		});
		it('... less values', async function () {
			// value
			$('input.dtsb-value:eq(0)').val('-3');
			$('input.dtsb-value').trigger('input');
			await dt.sleep(250); // Need to wait as there is a delay when inputting using SB
			expect($('tbody tr td:eq(0)').text()).toBe('c');
		});

		dt.html('basic');
		it('Ordering of numeric fields', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			table.row.add(['a', 'b', 'c', 2, '2003/06/24', 1000]);
			table.row.add(['a', 'b', 'c', 200, '2003/06/24', 1000]);

			table.draw();

			$('.dtsb-add').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('change');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('change');

			expect($('select.dtsb-value option:eq(1)').text()).toBe('2');
			expect($('select.dtsb-value option:eq(-1)').text()).toBe('200');
		});

		dt.html('basic');
		it('Empty data', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			table.draw();

			$('.dtsb-add').click();
			$('.dtsb-data').val(0).trigger('change');
			$('.dtsb-condition').val('null').trigger('change');

			expect(table.rows({page: 'current'}).count()).toBe(0);
		});

		it('Clear empty data', function () {
			$('.dtsb-delete').click();

			expect(table.rows({page: 'current'}).count()).toBe(10);
		});
	});
});
