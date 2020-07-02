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
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Contains',
								data: 'Name',
								value: ['Cox']
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
			$('#example tbody tr:eq(2) td:eq(2)').text('');
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				// DD-1566
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Empty',
								data: 'Office',
								value: ['Cox']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		// dt.html('basic'); //DD-1566
		// it('... Not empty', function() {
		// 	// DD-1566
		// 	$('#example tbody tr:eq(2) td:eq(2)').text('');
		// 	table = $('#example').DataTable({
		// 		dom: 'Qlfrtip',
		// 		// DD-1566
		// 		// destroy: true,
		// 		searchBuilder: {
		// 			preDefined: {
		// 				criteria: [
		// 					{
		// 						condition: 'Empty',
		// 						data: 'Office',
		// 						value: ['Cox']
		// 					}
		// 				],
		// 				logic: 'AND'
		// 			}
		// 		}
		// 	});

		// 	expect($('#example tbody tr').length).toBe(1);
		// 	expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		// });
	});

	// // Basic tests are in the other preDefined tests, so these are more complex
	// describe('Numeric tests', function() {
	// 	// Create test checks once DD-1568 fixed
	// 	// dt.html('basic');
	// 	// it('... Between', function() {
	// 	// 	table = $('#example').DataTable({
	// 	// 		dom: 'Qlfrtip',
	// 	// 		searchBuilder: {
	// 	// 			preDefined: {
	// 	// 				criteria: [
	// 	// 					{
	// 	// 						condition: 'Between',
	// 	// 						data: 'Age',
	// 	// 						value: ['2', '100']
	// 	// 					}
	// 	// 				],
	// 	// 				logic: 'AND'
	// 	// 			}
	// 	// 		}
	// 	// 	});
	// 	// 	// expect($('.dtsb-logic').text()).toBe('And');
	// 	// 	// expect($('.dtsb-criteria').length).toBe(2);
	// 	// 	// expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
	// 	// });

	// 	// Not Between

	// 	dt.html('basic'); //DD-1566
	// 	it('... Not empty', function() {
	// 		// DD-1566
	// 		$('#example tbody tr:eq(2) td:eq(2)').text('');
	// 		table = $('#example').DataTable({
	// 			dom: 'Qlfrtip',
	// 			// DD-1566
	// 			// destroy: true,
	// 			searchBuilder: {
	// 				preDefined: {
	// 					criteria: [
	// 						{
	// 							condition: 'Empty',
	// 							data: 'Office',
	// 							value: ['Cox']
	// 						}
	// 					],
	// 					logic: 'AND'
	// 				}
	// 			}
	// 		});

	// 		expect($('#example tbody tr').length).toBe(1);
	// 		expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
	// 	});

	// 	dt.html('basic'); //DD-1566
	// 	it('... Greater than equal to', function() {
	// 		// DD-1566
	// 		$('#example tbody tr:eq(2) td:eq(2)').text('');
	// 		table = $('#example').DataTable({
	// 			dom: 'Qlfrtip',
	// 			// DD-1566
	// 			// destroy: true,
	// 			searchBuilder: {
	// 				preDefined: {
	// 					criteria: [
	// 						{
	// 							condition: 'Greater Than Equal To',
	// 							data: 'Age',
	// 							value: ['66']
	// 						}
	// 					],
	// 					logic: 'AND'
	// 				}
	// 			}
	// 		});

	// 		expect($('#example tbody tr').length).toBe(2);
	// 		expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
	// 	});

	// 	dt.html('basic'); //DD-1566
	// 	it('... Greater than', function() {
	// 		// DD-1566
	// 		$('#example tbody tr:eq(2) td:eq(2)').text('');
	// 		table = $('#example').DataTable({
	// 			dom: 'Qlfrtip',
	// 			// DD-1566
	// 			// destroy: true,
	// 			searchBuilder: {
	// 				preDefined: {
	// 					criteria: [
	// 						{
	// 							condition: 'Greater Than',
	// 							data: 'Age',
	// 							value: ['66']
	// 						}
	// 					],
	// 					logic: 'AND'
	// 				}
	// 			}
	// 		});

	// 		expect($('#example tbody tr').length).toBe(1);
	// 		expect($('#example tbody tr').text()).toBe('No matching records found');
	// 	});
	// });

	// describe('Date tests', function() {
	// 	dt.html('basic');
	// 	it('... Before', function() {
	// 		table = $('#example').DataTable({
	// 			dom: 'Qlfrtip',
	// 			searchBuilder: {
	// 				preDefined: {
	// 					criteria: [
	// 						{
	// 							condition: 'Before',
	// 							data: 'Start date',
	// 							value: ['2009-01-13']
	// 						}
	// 					],
	// 					logic: 'AND'
	// 				}
	// 			}
	// 		});

	// 		expect($('#example tbody tr').length).toBe(10);
	// 		expect($('#example tbody tr:eq(1) td:eq(0)').text()).toBe('Ashton Cox');
	// 		expect($('#example tbody tr:eq(9) td:eq(0)').text()).toBe('Timothy Mooney');
	// 	});

	// 	dt.html('basic');
	// 	it('... After', function() {
	// 		table = $('#example').DataTable({
	// 			dom: 'Qlfrtip',
	// 			searchBuilder: {
	// 				preDefined: {
	// 					criteria: [
	// 						{
	// 							condition: 'After',
	// 							data: 'Start date',
	// 							value: ['2013-01-13']
	// 						}
	// 					],
	// 					logic: 'AND'
	// 				}
	// 			}
	// 		});

	// 		expect($('#example tbody tr').length).toBe(3);
	// 		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Jennifer Acosta');
	// 		expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Thor Walton');
	// 	});

	// 	// DD-1568
	// 	// dt.html('basic');
	// 	// it('... Between', function() {
	// 	// 	table = $('#example').DataTable({
	// 	// 		dom: 'Qlfrtip',
	// 	// 		searchBuilder: {
	// 	// 			preDefined: {
	// 	// 				criteria: [
	// 	// 					{
	// 	// 						condition: 'Between',
	// 	// 						data: 'Start date',
	// 	// 						value: ['2009-09-13', '2009-01-12']
	// 	// 					}
	// 	// 				],
	// 	// 				logic: 'AND'
	// 	// 			}
	// 	// 		}
	// 	// 	});

	// 	// 	expect($('#example tbody tr').length).toBe(7);
	// 	// 	expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
	// 	// 	expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Yuri Berry');
	// 	// });
	// });

	// describe('HTML tests', function() {
	// 	dt.html('html');
	// 	it('... Equals', function() {
	// 		table = $('#example').DataTable({
	// 			dom: 'Qlfrtip',
	// 			searchBuilder: {
	// 				preDefined: {
	// 					criteria: [
	// 						{
	// 							condition: 'Equals',
	// 							data: 'HTML',
	// 							value: ['$86,000']
	// 						}
	// 					],
	// 					logic: 'AND'
	// 				}
	// 			}
	// 		});

	// 		expect($('#example tbody tr').length).toBe(1);
	// 		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
	// 	});
	// });
});
