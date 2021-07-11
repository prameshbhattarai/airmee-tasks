import {createConnectionPool} from "./connection";
import {FieldInfo, QueryResult} from "postgresql-client";
import {Repository} from "./Repository";

export interface Query {
  query: string;
  params?: Array<string>
}

/**
 * Repository Class Implementation.
 */
export class RepositoryImpl implements Repository{

  /**
   * Execute query in database.
   * @param query
   */
  public async query(query: Query): Promise<Array<any>> {
    const connectionPool = await createConnectionPool();
    const response: QueryResult = await connectionPool.query(query.query, {params: query.params});
    await connectionPool.close();
    return this.mapRowWithFields(response);
  }

  /**
   * Map fields and rows from raw results.
   * @param queryResponse
   * @private
   */
  private mapRowWithFields(queryResponse: QueryResult): Array<any> {
    const objectKeys = queryResponse.fields.map((field: FieldInfo) => field.fieldName);
    const object = new Array<any>();
    queryResponse.rows.forEach((row: Array<any>) => {
      const eachRow = {};
      row.map((value, index) => {
        eachRow[objectKeys[index]] = value;
        if (value instanceof Buffer) {
          eachRow[objectKeys[index]] = value.toString();
        }
      })
      object.push(eachRow);
    })
    return object;
  }

}
