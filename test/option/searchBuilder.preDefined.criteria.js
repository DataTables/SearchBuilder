describe('searchBuilder - options - searchBuilder.preDefined.criteria', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	// Basic tests are in the other preDefined tests, so these are more complex
	describe('Functional tests', function() {
		// dt.html('basic');
		// it('Nested criteria - single depth', function() {
		// 	table = $('#example').DataTable({
		// 		dom: 'Qlfrtip',
		// 		searchBuilder: {
		// 			preDefined: {
		// 				criteria: [
		// 					{
		// 						criteria: [
		// 							{
		// 								condition: 'Not',
		// 								data: 'Office',
		// 								value: ['London']
		// 							},

		// 							{
		// 								condition: 'Greater Than',
		// 								data: 'Age',
		// 								value: ['55']
		// 							}
		// 						]
		// 					},
		// 					{
		// 						criteria: [
		// 							{
		// 								condition: 'Between',
		// 								data: 'Salary',
		// 								value: ['2', '10000000']
		// 							},

		// 							// {
		// 							// 	condition: 'Greater Than',
		// 							// 	data: 'Age',
		// 							// 	value: ['55']
		// 							// }
		// 						]
		// 					},

		// 					{
		// 						condition: 'Greater Than',
		// 						data: 'Age',
		// 						value: ['60']
		// 					}
		// 				],
		// 				logic: 'AND'
		// 			}
		// 		}
		// 	});

		// 	expect($('.dtsb-logic').text()).toBe('And');
		// 	expect($('.dtsb-criteria').length).toBe(2);
		// 	expect($('#example tbody tr td:eq(0)').text()).toBe('Ashton Cox');
		// });

		// dt.html('basic');
		// it('Can specifiy OR', function() {
		// 	table = $('#example').DataTable({
		// 		dom: 'Qlfrtip',
		// 		searchBuilder: {
		// 			preDefined: {
		// 				criteria: [
		// 					{
		// 						condition: 'Not',
		// 						data: 'Office',
		// 						value: ['London']
		// 					},

		// 					{
		// 						condition: 'Greater Than',
		// 						data: 'Age',
		// 						value: ['55']
		// 					}
		// 				],
		// 				logic: 'OR'
		// 			}
		// 		}
		// 	});

		// 	expect($('.dtsb-logic').text()).toBe('Or');
		// 	expect($('.dtsb-criteria').length).toBe(2);
		// 	expect($('#example tbody tr td:eq(0)').text()).toBe('Airi Satou');
		// });
	});
});
