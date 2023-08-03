"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const sqlite3 = require("sqlite3");
const dbFilepath = "db.sqlite";
let AppService = exports.AppService = class AppService {
    async getFlatCategories() {
        const db = new sqlite3.Database(dbFilepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM categories`, (error, rows) => {
                if (error) {
                    throw new Error(error.message);
                }
                else {
                    resolve(rows.map(row => ({ id: row.id, name: row.name })));
                }
            });
        });
    }
    async getCategoriesWithChildrens() {
        const db = new sqlite3.Database(dbFilepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM categories`, (error, rows) => {
                if (error) {
                    throw new Error(error.message);
                }
                else {
                    const result = rows.map(row => {
                        const childrens = rows.filter(child => child.parent_id === row.id).map(item => ({ id: item.id, name: item.name }));
                        return { id: row.id, name: row.name, childrens };
                    });
                    resolve(result);
                }
            });
        });
    }
    async getCategoriesWithAncestors() {
        const db = new sqlite3.Database(dbFilepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
        return new Promise((resolve, reject) => {
            db.all(`
          SELECT categories.id, categories.name, categories.parent_id, GROUP_CONCAT(categories_closure.ancestor_id) AS ancestors FROM categories
          LEFT JOIN categories_closure ON categories.id = categories_closure.descendant_id AND categories_closure.ancestor_id != categories.id
          GROUP BY categories.id
          `, (error, rows) => {
                if (error) {
                    throw new Error(error.message);
                }
                else {
                    const result = rows.map(row => {
                        const childrens = rows.filter(child => child.parent_id === row.id).map(item => ({ id: item.id, name: item.name }));
                        const ancestors = row.ancestors ? row.ancestors.split(',').map(Number).map(id => {
                            const ancestor = rows.find(category => category.id === id);
                            return {
                                id: ancestor.id,
                                name: ancestor.name,
                            };
                        }) : [];
                        return { id: row.id, name: row.name, ancestors, childrens };
                    });
                    resolve(result);
                }
            });
        });
    }
    async getCategoriesWithSearchVolume() {
        const db = new sqlite3.Database(dbFilepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
        function getSearchVolume(row, rows) {
            if (row.searchVolume) {
                averageSearchVolumeMap[row.id] = row.searchVolume;
                return row.searchVolume;
            }
            else {
                const childrens = rows.filter(child => child.parent_id === row.id).map(item => ({ id: item.id, name: item.name, searchVolume: item.searchVolume }));
                return childrens
                    .map(child => (child.id in averageSearchVolumeMap) ? averageSearchVolumeMap[child.id] : getSearchVolume(child, rows))
                    .reduce((acc, value) => {
                    averageSearchVolumeMap[row.id] = acc + value;
                    return acc + value;
                }, 0);
            }
        }
        let averageSearchVolumeMap = {};
        return new Promise((resolve, reject) => {
            db.all(`SELECT categories.id, categories.name, categories.parent_id, volumes.category_id, SUM(volumes.volume)/24 as searchVolume FROM categories
          LEFT JOIN volumes ON categories.id = volumes.category_id
          GROUP BY categories.id`, (error, rows) => {
                if (error) {
                    throw new Error(error.message);
                }
                else {
                    const result = rows.map(row => {
                        return { id: row.id, name: row.name, averageMonthlyVolume: (row.id in averageSearchVolumeMap) ? averageSearchVolumeMap[row.id] : getSearchVolume(row, rows) };
                    });
                    resolve(result);
                }
            });
        });
    }
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map