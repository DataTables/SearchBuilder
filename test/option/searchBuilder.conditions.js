describe('searchBuilder - options - searchBuilder.conditions', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check = is there by default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');

			expect($('.dtsb-condition option:eq(1)').text()).toBe('Equals');
			expect($('.dtsb-condition ').text().includes('Equals')).toBe(true);

		});
		dt.html('basic');
		it('... and confirm it can be removed', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					conditions: {
						num: {
							'=': null
						}
					}
				}
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('input');

			expect($('.dtsb-condition option:eq(5)').text()).toBe('Greater Than');
			expect($('.dtsb-condition ').text().includes('Equals')).toBe(false);

		});

		// DD-1601
		// dt.html('basic');
		// it('... and confirm it can be removed', function() {
		// 	$('#myTable').DataTable( {
		// 		dom: 'Qlfrtip',
		// 		searchBuilder:{
		// 			conditions:{
		// 				num:{
		// 					multipleOf: {
		// 						conditionName: 'Multiple Of',
		// 						init: function (that, fn, preDefined = null) {
		// 							var el =  $('<input/>').on('input', function() { fn(that, this) });
			 
		// 							if (preDefined !== null) {
		// 								$(el).val(preDefined[0]);
		// 							}
			 
		// 							return el;
		// 						},
		// 						inputValue: function (el) {
		// 							return $(el[0]).val();
		// 						},
		// 						isInputValid: function (el, that) {
		// 							return $(el[0]).val().length !== 0;
		// 						},
		// 						search: function (value, comparison) {
		// 							return value % comparison === 0;
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	})
		// });
	});
});
