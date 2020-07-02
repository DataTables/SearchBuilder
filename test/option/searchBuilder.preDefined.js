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
								condition: 'Equals',
								dataTitle: 'Office',
								value: ['Edinburgh']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('.dtsb-criteria').length).toBe(1);
			expect($('.dtsb-title').text()).toBe('Search Builder (1)');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Cedric Kelly');
		});

		dt.html('basic');
		it('Complex criteria search', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Not',
								dataTitle: 'Office',
								value: ['London']
							},
							{
								criteria: [
									{
										condition: 'Contains',
										dataTitle: 'Office',
										value: ['h']
									},
									{
										condition: 'Greater Than',
										dataTitle: 'Age',
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
			expect($('.dtsb-title').text()).toBe('Search Builder (3)');
			expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Language setting', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
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
								condition: 'Not',
								dataTitle: 'Office',
								value: ['London']
							},
							{
								criteria: [
									{
										condition: 'Contains',
										dataTitle: 'Office',
										value: ['h']
									},
									{
										condition: 'Greater Than',
										dataTitle: 'Age',
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

		dt.html('basic');
		it('As a button', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
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
										condition: 'Not',
										dataTitle: 'Office',
										value: ['London']
									},
									{
										criteria: [
											{
												condition: 'Contains',
												dataTitle: 'Office',
												value: ['h']
											},
											{
												condition: 'Greater Than',
												dataTitle: 'Age',
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

	describe('Odds and Ends tests', function() {
		dt.html('basic');
		it('Changing column title', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				columnDefs: [{
					targets: 2, title: 'Second Column'
				}],
				searchBuilder: {
					preDefined: {
						criteria: [
							{
								condition: 'Not',
								dataTitle: 'Second Column',
								value: ['London']
							}
						],
						logic: 'AND'
					}
				}
			});

			expect($('.dtsb-criteria').length).toBe(1);
			expect($('#example tbody tr td:eq(0)').text()).toBe('Airi Satou');
		});
	});
});
