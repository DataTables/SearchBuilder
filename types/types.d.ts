// Type definitions for DataTables SearchBuilder
//
// Project: https://datatables.net/extensions/searchbuilder/, https://datatables.net

/// <reference types="jquery" />

import DataTables, {Api} from 'datatables.net';
import {IDefaults, IDetails, II18n} from './searchBuilder';

export default DataTables;

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables' types integration
 */
declare module 'datatables.net' {
	interface Config {
		/**
		 * SearchBuilder extension options
		 */
		searchBuilder?: boolean | string[] | ConfigSearchBuilder | ConfigSearchBuilder[];
	}

	interface ConfigLanguage {
		/**
		 * SearchBuilder language options
		 */
		searchBuilder?: ConfigSearchBuilderLanguage;
	}

	interface ConfigColumns {
		searchBuilder?: {
			/** Set a default condition for this column */
			defaultCondition?: number | string;

			/** Set values of orthogonal data for rendering functions */
			orthogonal?: {[key: string]: string};
		};

		/** Set a custom title for a column in SearchBuilder */
		searchBuilderTitle?: string;

		/** Set the SearchBuilder type to use for a column */
		searchBuilderType?: string;
	}

	interface Feature {
		searchBuilder?: string[] | ConfigSearchBuilder | ConfigSearchBuilder[];
	}

	interface Api<T> {
		/**
		 * SearchBuilder methods container
		 * 
		 * @returns Api for chaining with the additional SearchBuilder methods
		 */
		searchBuilder: ApiSearchBuilder<T>;
	}

	interface DataTablesStatic {
		/**
		 * SearchBuilder class
		 */
		SearchBuilder: {
			/**
			 * Create a new SearchBuilder instance for the target DataTable
			 */
			new (dt: Api<any>, settings: string[] | ConfigSearchBuilder | ConfigSearchBuilder[]): DataTablesStatic['SearchBuilder'];

			/**
			 * SearchBuilder version
			 */
			version: string;

			/**
			 * Default configuration values
			 */
			defaults: ConfigSearchBuilder;
		}
	}
}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Options
 */

interface ConfigSearchBuilder extends Partial<IDefaults> {}

interface ConfigSearchBuilderLanguage extends DeepPartial<II18n> {}


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * API
 */
interface ApiSearchBuilder<T> extends Api<T> {
	/**
	 * Returns the node of the SearchBuilder Container
	 */
	container(): JQuery<HTMLElement>;

	/**
	 * Gets the details of the current SearchBuilder setup
	 */
	getDetails(): IDetails;

	/**
	 * Rebuild the search to a given state.
	 *
	 * @param state Object of the same structure that is returned from searchBuilder.getDetails().
	 * This contains all of the details needed to rebuild the state.
	 * @returns self for chaining
	 */
	rebuild(state: IDetails): Api<T>;
}
