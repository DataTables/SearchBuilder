let $;
let DataTable;

export function setJQuery(jq) {
    $ = jq;
    DataTable = jq.fn.DataTable;
};

import Criteria from './criteria';
export default class SearchBuilder {
    private static version = '0.0.1';

    private static classes = {
        container: 'searchBuilder'
    }

    private static defaults = {

    }

    public classes;
    public dom;
    public c;
    public s;

    constructor (builderSettings, opts) {
        // Check that the required version of DataTables is included
        if(! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')){
            throw new Error('SearchPane requires DataTables 1.10 or newer');
        }

        let table = new DataTable.Api(builderSettings);
        this.classes = $.extend(true, {}, SearchBuilder.classes);

        // Get options from user
        this.c = $.extend(true, {}, SearchBuilder.defaults, opts);
        
        this.dom = {
            clearAll: $('<button type="button">Clear All</button>').addClass(this.classes.clearAll),
            container: $('<div/>').addClass(this.classes.container),
            searchBuilder: $('<div/>').addclass(this.classes.builder),
            title: $('<div/>').addClass(this.classes.title),
            wrapper: $('<div/>'),
        }

        this.s = {
            dt: table,
            topGroup: undefined
        }

        if (table.settings()[0]._searchBuilder !== undefined) {
			return;
        }
        
        table.settings()[0]._searchBuilder = this;

        this.setUp();
    }

    /**
	 * returns the container node for the searchPanes
	 */
	public getNode(){
		return this.dom.container;
    }

    private setUp(){
        this.s.topGroup = new Group();

        $(this.dom.clearAll).on('click', () => {
            this.s.topGroup = new Group();

            this.build();
        })


    }

    private build() {
        $(this.dom.container).empty();
        $(this.dom.container).append(this.dom.title);
        $(this.dom.container).append(this.dom.clearAll);
        this.dom.topGroup = this.s.topGroup.getNode();
        $(this.dom.container).append(this.dom.topGroup);

        $(this.dom.topGroup).on('dtsp-search', () => {
            this.search();
        })
    }

    private search() {
        for(let row of this.s.dt.rows().data().toArray()){
            console.log(row, this.s.topGroup.search(row))
        }
    }
}