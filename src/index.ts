import * as fs from "fs";
import {createConnection} from "@/util/createConnection"; // Типы
import {convertType} from "@/util/convertType";
import {createConfig} from "@/util/createConfig";
import chalk from "chalk";
import {selectTablesCommentsAdapter} from "@/util/selectTablesCommentsAdapter";
import {selectTablesColumnsCommentsAdapter} from "@/util/selectTablesColumnsCommentsAdapter";
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
        let dbs = rows
            .map((row: Record<string, string>) => row.Database || row.Databases)
            .filter((dbName: string) => !!dbName);
        if(!allowedDbs.length) {
            dbs = dbs.filter((db: string) => !["information_schema", "mysql", "sys"].includes(db)) // filter system tables
        } else {
            dbs = dbs.filter((db: string) => allowedDbs.includes(db))
        }
        for(const db of dbs) {
            console.log(chalk.blue(`Start parse ${db}`));
            writeOutput(`export namespace ${db} {`, 0);
            await conn.query(`USE ${db}`);
            const rows = await conn.query(`SHOW TABLES;`);
            const tables = rows.map((row: Record<string, any>) => Object.values(row)[0]);
            const tablesCommentsAdapter = await selectTablesCommentsAdapter(conn, db);
            for(const table of tables) {
                const comment = tablesCommentsAdapter[table];
                comment && writeOutput(`// ${comment}`, 1);
                writeOutput(`export interface ${table} {`, 1);
                const columns = await conn.query(`DESCRIBE ${table};`);
                const columnsCommentsAdapter = await selectTablesColumnsCommentsAdapter(conn, db, table);
                for(const column of columns) {
                    const comment = columnsCommentsAdapter[column.Field] ? ` // ${columnsCommentsAdapter[column.Field]}`:"";
                    const isNull = (column.Null || "").toLowerCase() === 'yes';
                    const defaultValueComment = column.Default === null || typeof column.Default === "undefined" ? "" : ` // default: ${column.Default}`;
                    writeOutput(`${column.Field}:${convertType(column.Type, dbType, conf)}${isNull ? "|null":""};${defaultValueComment}${comment}`, 2);
                }
                writeOutput(`}`, 1);
            }
            writeOutput(`}`, 0);
            writeOutput("\n");
            console.log(chalk.green(`Done!`));
        }
        await conn.end();
    }

    const str = output.join("\n");
    fs.writeFileSync(conf.file!, str, {
        encoding: "utf-8"
    });
})();









