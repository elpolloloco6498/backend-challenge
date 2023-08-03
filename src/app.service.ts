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

  async getCategoriesWithAncestors(): Promise<Category[]> {
    const db = new sqlite3.Database(dbFilepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });

    return new Promise((resolve, reject) => {
        db.all(
          `
          SELECT categories.id, categories.name, categories.parent_id, GROUP_CONCAT(categories_closure.ancestor_id) AS ancestors FROM categories
          LEFT JOIN categories_closure ON categories.id = categories_closure.descendant_id AND categories_closure.ancestor_id != categories.id
          GROUP BY categories.id
          `, (error, rows) => {
          if (error) {
            throw new Error(error.message);
          } else {
            const result = rows.map(row => {
              const childrens = rows.filter(child => child.parent_id === row.id).map(item => ({id: item.id, name: item.name}))
              const ancestors = row.ancestors ? row.ancestors.split(',').map(Number).map(id => {
                const ancestor = rows.find(category => category.id === id)
                return {
                  id: ancestor.id,
                  name: ancestor.name,
                }
              }): []
              return {id: row.id, name: row.name, ancestors, childrens}
            })
            resolve(result)
          }
        });
    });
  }

  async getCategoriesWithSearchVolume(): Promise<Category[]> {
    const db = new sqlite3.Database(dbFilepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });

    function getSearchVolume(row: any, rows: any) {
      // using a hash map in order to save computational energy
      if (row.searchVolume) {
        averageSearchVolumeMap[row.id] = row.searchVolume
        return row.searchVolume
      } else {
        const childrens = rows.filter(child => child.parent_id === row.id).map(item => ({id: item.id, name: item.name, searchVolume: item.searchVolume}))
        return childrens
        .map(child => (child.id in averageSearchVolumeMap) ? averageSearchVolumeMap [child.id] : getSearchVolume(child, rows))
        .reduce((acc, value) => {
          averageSearchVolumeMap[row.id] = acc + value;
          return acc + value;
        }, 0)
      }
    }

    let averageSearchVolumeMap: Record<number, number> = {};

    return new Promise((resolve, reject) => {
        db.all(
          `SELECT categories.id, categories.name, categories.parent_id, volumes.category_id, SUM(volumes.volume)/24 as searchVolume FROM categories
          LEFT JOIN volumes ON categories.id = volumes.category_id
          GROUP BY categories.id`, (error, rows) => {
          if (error) {
            throw new Error(error.message);
          } else {
            const result = rows.map(row => {
              return {id: row.id, name: row.name, averageMonthlyVolume: (row.id in averageSearchVolumeMap) ? averageSearchVolumeMap[row.id] : getSearchVolume(row, rows)}
            })
            resolve(result)
          }
        });
    });
  }
}
