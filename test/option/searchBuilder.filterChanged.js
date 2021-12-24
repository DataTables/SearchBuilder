describe('searchBuilder - options - searchBuilder.filterChanged', function () {
	let table;
	let count = 0;
	let num = 0;

	dt.libs({
		js: ['jquery', 'datatables', 'searchbuilder', 'datetime'],
		css: ['datatables', 'searchbuilder', 'datetime']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Not called on initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Qlfrtip',

				searchBuilder: {
					filterChanged: function (cnt) {
						count = cnt;
						num++;
					}
				}
			});

			expect(count).toBe(0);
			expect(num).toBe(0);
		});
		it('... add a condition', function () {
			$('.dtsb-group button').click();

			$('.dtsb-data').val(3);
			$('.dtsb-data').trigger('change');

			expect(count).toBe(1);
			expect(num).toBe(1);
		});
		it('... add another condition', function () {
			$('.dtsb-add').click();

			$('.dtsb-data').trigger('change');

			expect(count).toBe(2);
			expect(num).toBe(2);
		});
		it('... remove a condition', function () {
			$('.dtsb-delete:eq(1)').click();

			expect(count).toBe(1);
			// expect(num).toBe(3);
			// DD-2412
			expect(num).toBe(4);
		});
	});
});
