describe('searchBuilder - options - searchBuilder.preDefined.condition', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	// Just scatterguning a few - if issues with them, will fill in the blanks
	describe('String tests', function() {
		dt.html('basic');
		it('... Contains', function() {
			$('#example tbody tr:eq(2) td:eq(2)').text('');
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Contains',
								data: 'Name',
								value: ['Ox']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... Empty', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Empty',
								data: 'Office',
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... Not empty', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Not Empty',
								data: 'Office'
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(10);
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
		});
	});

	describe('Numeric tests', function() {
		dt.html('basic');
		it('... Between', function() {
			$('#example tbody tr:eq(3) td:eq(3)').text('');
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Between',
								data: 'Age',
								value: ['63', '70']
							}
						],
						logic: 'AND'
					}
				}
			});
			expect($('#example tbody tr').length).toBe(8);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... Not Between', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Not Between',
								data: 'Age',
								value: ['15', '64']
							}
						],
						logic: 'AND'
					}
				}
			});
			expect($('#example tbody tr').length).toBe(4);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... Empty', function() {
			$('#example tbody tr:eq(2) td:eq(2)').text('');
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Empty',
								data: 'Age',
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Cedric Kelly');
		});
		it('... Greater than equal to', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Greater Than Equal To',
								data: 'Age',
								value: ['66']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(2);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... Greater than', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Greater Than',
								data: 'Age',
								value: ['66']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr').text()).toBe('No matching records found');
		});
	});

	describe('Date tests', function() {
		dt.html('basic');
		it('... Before', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Before',
								data: 'Start date',
								value: ['2009-01-13']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(10);
			expect($('#example tbody tr:eq(1) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('#example tbody tr:eq(9) td:eq(0)').text()).toBe('Timothy Mooney');
		});
		it('... After', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'After',
								data: 'Start date',
								value: ['2013-01-13']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(3);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Jennifer Acosta');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Thor Walton');
		});

		// DD-1568

		it('... Between', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Between',
								data: 'Start date',
								value: ['2009-09-13', '2009-01-12']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(7);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('#example tbody tr:eq(6) td:eq(0)').text()).toBe('Yuri Berry');
		});
	});

	describe('HTML tests', function() {
		dt.html('html');
		it('... Equals', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Equals',
								data: 'HTML',
								value: ['$86,000']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('... Between', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Between',
								data: 'HTML',
								value: ['86000', '90000']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(3);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Jonas Alexander');
		});
	});
});
