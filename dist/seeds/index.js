"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const sqlite3 = require("sqlite3");
const categories_json_1 = require("./data/categories.json");
const volumes_json_1 = require("./data/volumes.json");
(async () => {
    const db = await (0, sqlite_1.open)({
        filename: "db.sqlite",
        driver: sqlite3.Database,
    });
    await db.run("DROP TABLE IF EXISTS categories");
    await db.run("DROP TABLE IF EXISTS categories_closure");
    await db.run("DROP TABLE IF EXISTS volumes");
    await db.run(`
    CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        parent_id INTEGER,
        FOREIGN KEY (parent_id) REFERENCES categories (id)
    )`);
    await db.run(`
    CREATE TABLE categories_closure (
        ancestor_id INTEGER,
        descendant_id INTEGER,
        FOREIGN KEY (ancestor_id) REFERENCES categories (id)
        FOREIGN KEY (descendant_id) REFERENCES categories (id)
    )`);
    await db.run(`
    CREATE TABLE volumes (
        category_id INTEGER,
        date DATE,
        volume INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )`);
    for (const category of categories_json_1.categories) {
        await db.run("INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)", [category.id, category.name, category.ancestors[category.depth - 1]?.id]);
        for (const ancestor of category.ancestors) {
            await db.run("INSERT INTO categories_closure (ancestor_id, descendant_id) VALUES (?, ?)", [ancestor.id, category.id]);
        }
    }
    for (const volume of volumes_json_1.volumes) {
        await db.run("INSERT INTO volumes (category_id, date, volume) VALUES (?, ?, ?)", [volume.category_id, volume.date, volume.volume]);
    }
    await db.close();
})();
//# sourceMappingURL=index.js.map