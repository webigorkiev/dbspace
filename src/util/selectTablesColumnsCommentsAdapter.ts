import {Connection} from "mariadb";
import chalk from "chalk";

export const selectTablesColumnsCommentsAdapter = async (conn: Connection, db: string, table: string) => {
    const adapter = {} as Record<string, string>;
    try {
        const comments = await conn.query<{id: string, label: string}[]>(`
            SELECT column_name as id, 
               column_comment as label
            from INFORMATION_SCHEMA.COLUMNS
            where table_name = ${conn.escape(table)}
              and table_schema = ${conn.escape(db)};
        `);
        comments.forEach(({id, label}) => {
            adapter[id] = label;
        })
    } catch (e: any) {
        console.log(chalk.red(`${table}: Error select tables columns comments or not supported`));
    }

    return adapter;
}