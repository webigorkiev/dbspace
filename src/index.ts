import * as fs from "fs";
import {createConnection} from "@/util/createConnection"; // Типы
import {convertType} from "@/util/convertType";
import {createConfig} from "@/util/createConfig";
const conf = createConfig();
const connections = conf.connections || [];
(async () => {
    const output: string[] = [];
    const writeOutput = (
        text: string,
        tab: number = 0
    ) => output.push("".padStart(tab * 4, " ") + text);

    for(const connection of connections) {
        const conn = await createConnection(connection);
        const rows = await conn.query(`SHOW DATABASES;`);
        const allowedDbs = connection?.dbs || []
        const dbType = connection?.type || "mariadb";
        const dbs = rows
            .map((row: Record<string, string>) => row.Database)
            .filter((db: string) => !["information_schema", "mysql", "sys"].includes(db) && !allowedDbs.includes(db)); // filter system tables
        for(const db of dbs) {
            writeOutput(`export namespace ${db} {`, 0);
            await conn.query(`USE ${db};`);
            const rows = await conn.query(`SHOW TABLES;`);
            const tables = rows.map((row: Record<string, any>) => Object.values(row)[0]);
            for(const table of tables) {
                writeOutput(`export interface ${table} {`, 1);
                const columns = await conn.query(`DESCRIBE ${table};`);
                for(const column of columns) {
                    writeOutput(`${column.Field}:${convertType(column.Type, dbType, conf)};`, 2);
                }
                writeOutput(`}`, 1);
            }
            writeOutput(`}`, 0);
            writeOutput("\n");
        }
        await conn.end();
    }

    const str = output.join("\n");
    fs.writeFileSync(conf.file!, str, {
        encoding: "utf-8"
    });
})();









