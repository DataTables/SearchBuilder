describe('searchBuilder - integrations - Editor', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'editor', 'searchbuilder', 'datetime'],
		css: ['datatables', 'editor', 'searchbuilder', 'datetime']
	});

	describe('Check the behaviour', function() {
		let table, editor;
		dt.html('basic_id');
		it('Check options originally', function() {
			editor = new $.fn.dataTable.Editor({
				table: '#example',
				fields: dt.getTestEditorColumns()
			});

			table = $('#example').DataTable({
				dom: 'QBlfrtip',
				columns: dt.getTestColumns()
			});

			$('.dtsb-group button').click();

			$('.dtsb-data').val(1);
			$('.dtsb-data').trigger('input');

			$('.dtsb-condition').val('=');
			$('.dtsb-condition').trigger('input');

			expect($('.dtsb-value option:eq(15)').text()).toBe('Junior Technical Author');
		});
		it('... ensure pane updates when record edited', function() {
			editor
				.edit(2)
				.set('position', 'Abc')
				.submit();

			expect($('.dtsb-value option:eq(15)').text()).toBe('Junior Javascript Developer');
			expect($('.dtsb-value option:eq(1)').text()).toBe('Abc');
		});
		it('... ensure pane updates when record deleted', function() {
			editor.remove(2, false).submit();

			expect($('.dtsb-value option:eq(15)').text()).toBe('Marketing Designer');
			expect($('.dtsb-value option:eq(1)').text()).toBe('Accountant');
		});
		it('Tidy up', function() {
			editor.destroy();
		});
	});
});
