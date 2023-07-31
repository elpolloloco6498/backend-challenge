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
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map