describe('searchBuilder - options - searchBuilder.depthLimit', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder'],
		css: ['datatables', 'searchbuilder']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No limit by default', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			$('.dtsb-group button').click();
			$('button.dtsb-add').click();

			expect($('.dtsb-logicContainer').length).toBe(1);
		});
		it('... add another', function() {
			$('button.dtsb-right:eq(1)').click();
			expect($('.dtsb-logicContainer').length).toBe(2);
		});
		it('... and another', function() {
			$('button.dtsb-add:eq(0)').click();
			$('button.dtsb-right:eq(2)').click();
			expect($('.dtsb-logicContainer').length).toBe(3);
		});

		dt.html('basic');
		it('Impose limit', function() {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',
				searchBuilder: {
					depthLimit: 2
				}
			});

			$('.dtsb-group button').click();
			$('button.dtsb-add').click();

			expect($('.dtsb-logicContainer').length).toBe(1);
		});
		it('... can add another', function() {
			$('button.dtsb-right:eq(1)').click();
			expect($('.dtsb-logicContainer').length).toBe(2);
		});
		it('... and another', function() {
			$('button.dtsb-add:eq(0)').click();

			expect($('button.dtsb-right').length).toBe(2);
		});
	});
});
