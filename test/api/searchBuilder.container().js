describe('searchBuilder - API - searchBuilder.container()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Ensure it is a function', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});
			expect(typeof table.searchBuilder.container).toBe('function');
		});
		it('Returns a jQuery instance', function () {
			expect(table.searchBuilder.container() instanceof $).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Ensure it returns container', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip'
			});

			expect(table.searchBuilder.container().text()).toBe('Custom Search BuilderAdd Condition');
		});
	});
});
