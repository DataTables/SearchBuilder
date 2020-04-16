let $;
let DataTable;

export function setJQuery(jq) {
  $ = jq;
  DataTable = jq.fn.dataTable;
};

export default class Criteria {
    private static version = '0.0.1';

    private static classes = {

    }

    private static defaults = {

    }

    public classes;
	public dom;
	public c;
	public s;
    
    constructor(criteriaSettings, opts) {
        // Check that the required version of DataTables is included
        if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
            throw new Error('SearchPane requires DataTables 1.10 or newer');
        }

        let table = new DataTable.Api(criteriaSettings);

		this.classes = $.extend(true, {}, Criteria.classes);

		// Get options from user
        this.c = $.extend(true, {}, Criteria.defaults, opts);
        
        this.s = {
            dt: table,
            fields: {},
            conditions: {},
            values: {}
        }

        this.dom = {
            container: $('<div/>').addClass(this.classes.criteria),
            field: $('<select/>').addClass(this.classes.field),
            condition: $('<select/>').addClass(this.classes.condition, this.classes.disabled),
            value: $('<select/>').addClass(this.classes.value, this.classes.disabled)
        }

        this.buildCriteria();

        this.populateField();
    }

    public getNode(){
        return this.dom.container;
    }

    private buildCriteria() {
        $(this.dom.container).append(this.dom.field).append(this.dom.condition).append(this.dom.value);
    }

    private populateField() {
        this.s.dt.columns().eq(0).each( function ( index ) {
            this.s.fields.push(this.s.dt.column( index ).dataSrc());
        } );

        for(let field of this.s.fields){
            $(this.dom.field).append($('<option>', { 
                value: field,
                text : field 
            }));
        }
    }

    private populateCondition() {

    }

    private populateValue() {

    }
}