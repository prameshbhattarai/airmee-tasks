import {createConnectionPool} from "./connection";
import {FieldInfo, QueryResult} from "postgresql-client";

export interface Query {
  query: string;
  params?: Array<string>
}

export class Repository {

  public static async query(query: Query): Promise<Array<any>> {
    const connectionPool = await createConnectionPool();
    const response: QueryResult = await connectionPool.query(query.query, {params: query.params});
    await connectionPool.close();
    return this.mapRowWithFields(response);
  }

  private static mapRowWithFields(queryResponse: QueryResult): any {
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
