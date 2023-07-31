import { Injectable } from '@nestjs/common';
import { FlatCategory } from 'schemas/category';
import * as sqlite3 from "sqlite3"

const dbFilepath = "db.sqlite"

@Injectable()
export class AppService {
  async getCategories(): Promise<FlatCategory[]> {
    const db = new sqlite3.Database(dbFilepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });

    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM categories`, (error, rows) => {
          if (error) {
            throw new Error(error.message);
          } else {
            resolve(rows.map(row => ({id: row.id, name: row.name})))
          }
        });
    });
  }
}
