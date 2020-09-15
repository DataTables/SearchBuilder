describe('searchBuilder - options - searchBuilder.preDefined', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'searchbuilder'],
		css: ['datatables', 'buttons', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Single criteria search', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: '=',
								data: 'Office',
								value: ['Edinburgh']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('.dtsb-criteria').length).toBe(1);
			expect($('.dtsb-title').text()).toBe('Custom Search Builder (1)');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Cedric Kelly');
		});
		it('Complex criteria search', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: '!=',
								data: 'Office',
								value: ['London']
							},
							{
								criteria: [
									{
										condition: 'contains',
										data: 'Office',
										value: ['h']
									},
									{
										condition: '>',
										data: 'Age',
										value: ['50']
									}
								],
								logic: 'OR'
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('.dtsb-criteria').length).toBe(3);
			expect($('.dtsb-title').text()).toBe('Custom Search Builder (3)');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('Language setting', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				destroy: true,
				language: {
					searchBuilder: {
						title: {
							_: 'Filters (%d)'
						}
					}
				},
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: '!=',
								data: 'Office',
								value: ['London']
							},
							{
								criteria: [
									{
										condition: 'contains',
										data: 'Office',
										value: ['h']
									},
									{
										condition: '>',
										data: 'Age',
										value: ['50']
									}
								],
								logic: 'OR'
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('.dtsb-criteria').length).toBe(3);
			expect($('.dtsb-title').text()).toBe('Filters (3)');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
		it('As a button', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				destroy: true,
				language: {
					searchBuilder: {
						title: {
							_: 'Filters (%d)'
						}
					}
				},
				buttons: [
					{
						extend: 'searchBuilder',

						config: {
							preDefined: {
								criteria: [
									{
										condition: '!=',
										data: 'Office',
										value: ['London']
									},
									{
										criteria: [
											{
												condition: 'contains',
												data: 'Office',
												value: ['h']
											},
											{
												condition: '>',
												data: 'Age',
												value: ['50']
											}
										],
										logic: 'OR'
									}
								],
								logic: 'AND'
							}
						}
					}
				]
			});

			expect($('.dt-button').text()).toBe('Search Builder (3)');
		});
		it('... open button', function() {
			$('.dt-button').click();
			expect($('.dtsb-criteria').length).toBe(3);
			expect($('.dtsb-title').text()).toBe('Filters (3)');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});
	});
});
