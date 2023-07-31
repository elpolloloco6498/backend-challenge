import { Injectable } from '@nestjs/common';
import { Category } from 'schemas/category';
import * as sqlite3 from "sqlite3"

const dbFilepath = "db.sqlite"

@Injectable()
export class AppService {

  async getFlatCategories(): Promise<Category[]> {
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

  async getCategoriesWithChildrens(): Promise<Category[]> {
    const db = new sqlite3.Database(dbFilepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });

    return new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM categories`, (error, rows) => {
          if (error) {
            throw new Error(error.message);
          } else {
            const result = rows.map(row => {
              const childrens = rows.filter(child => child.parent_id === row.id).map(item => ({id: item.id, name: item.name}))
              return {id: row.id, name: row.name, childrens}
            })
            resolve(result)
          }
        });
    });
  }
}
