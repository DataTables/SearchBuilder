let $;
let DataTable;

export function setJQuery(jq) {
  $ = jq;
  DataTable = jq.fn.dataTable;
};

import Criteria from './criteria';

export default class Group {
    private static version = '0.0.1';

    private static classes = {
        group: 'dtsb-group',
        add: 'dtsb-add',
        logic: 'dtsb-logic',
        button: 'dtsb-button',
        inputButton: 'dtsb-iptbtn',
        roundButton: 'dtsb-rndbtn'
    }

    private static defaults = {

    }

    public classes;
	public dom;
	public c;
	public s;
    
    constructor(groupSettings, table) {
        // Check that the required version of DataTables is included
        if (! DataTable || ! DataTable.versionCheck || ! DataTable.versionCheck('1.10.0')) {
            throw new Error('SearchPane requires DataTables 1.10 or newer');
        }

		this.classes = $.extend(true, {}, Group.classes);

		// Get options from user
        this.c = $.extend(true, {}, Group.defaults);
        
        this.s = {
            dt: table,
            criteria: [],
            logic: undefined,
            subgroups: [],
        }

        this.dom = {
            container: $('<div/>').addClass(this.classes.group),
            add: $('<button/>').addClass(this.classes.add).addClass(this.classes.button),
            logic: $('<button/>').addClass(this.classes.logic).addClass(this.classes.button)
        }

        this.setup();

    }

    public getNode(){
        return this.dom.container;
    }

    public search(rowData){
        if(this.s.logic === "AND"){
            this.andSearch(rowData);
        }
        else if(this.s.logic === "OR"){
            this.orSearch(rowData);
        }
    }

    private andSearch(rowData){
        for(let crit of this.s.criteria){
            if(!crit.exec(rowData)){
                return false;
            }
        }
        for(let gro of this.s.subgroups){
            if(!gro.search(rowData)){
                return false;
            }
        }
        return true;
    }

    private orSearch(rowData){
        for(let crit of this.s.criteria){
            if($(crit.dom.condition).children("option:selected").val().comparator(rowData)){
                return true;
            }
        }
        for(let gro of this.s.subgroups){
            if(gro.search(rowData)){
                return true;
            }
        }
        return false;
    }

    private setup() {
        $(this.dom.add).on('click', () => {
            this.addCriteria();
        })
        $(this.dom.add).text("ADD");
        $(this.dom.container).append(this.dom.add);
    }

    private addCriteria(){
        let index = this.s.criteria.length;
        let crit = new Criteria(undefined, undefined, this.s.dt, index);
        $(this.dom.container).append(crit.getNode());
        this.s.criteria.push({
            criteria: crit,
            index
        })

        $(crit.dom.delete).on('click', () => {
            for(let i = 0; i < this.s.criteria.length; i++){
                if(this.s.criteria[i].index === crit.s.index) {
                    this.s.criteria.splice(i, 1);
                    break;
                }
            }

            for(let i = 0; i < this.s.criteria.length; i++){
                this.s.criteria[i].index = i;
                this.s.criteria[i].criteria.s.index = i;
            }
        });
    }
}