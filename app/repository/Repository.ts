import {Query} from "./RepositoryImpl";

/**
 * Interface for Repository class.
 */
export abstract class Repository {

  /**
   * Execute query in database.
   * @param query
   */
  public abstract query(query: Query): Promise<Array<any>>;

}

