import {Connection} from "mariadb";
import chalk from "chalk";

export const selectTablesCommentsAdapter = async (conn: Connection, db: string) => {
    const adapter = {} as Record<string, string>;
    try {
        const comments = await conn.query<{id: string, label: string}[]>(`
            SELECT table_name as id,
                table_comment as label
            FROM INFORMATION_SCHEMA.TABLES
            WHERE table_schema = :db;
        `, {db});
        comments.forEach(({id, label}) => {
            adapter[id] = label;
        })
    } catch (e: any) {
        console.log(chalk.red(`Error select tables comments: ${e.message}`));
    }

    return adapter;
}