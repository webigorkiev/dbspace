import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import margv from "margv"; // Чтение из командной строки
import chalk from "chalk"; // Подсветка в консоли
import {createConnection} from "@/util/createConnection"; // Типы
import {convertType} from "@/util/convertType";

import type {dbspace} from "@/types";



// Данные из командной строки
const defaultConfigFile = './dbspace.json';
const defaultOutputFile = "./dbspace.ts";

// --config -c configFile.json
const argv = margv();
const configFile = argv.config || argv.c || defaultConfigFile;

// TODO Чтение файла конфигурация если он есть

// Получаем конфигурацию и проводим нормализацию
// Читаем выбранные базы данных и создаем обект
// По объекту строим файл интерфейсов

let conf: dbspace.Config = {
    connections: []
};
const filePath = path.resolve(path.resolve(), configFile);

try {
    conf = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));
} catch (e) { // Если ошибка
    console.log(chalk.red("Ошибка. Файл конфигурации ") + chalk.bold(filePath) + chalk.red(" не найден."));
    process.exit(0);
}
conf.file = argv.file || argv.f || conf.file || defaultOutputFile;
const connections = conf.connections || [];



// Основной цикл подключений
(async () => {
    const output: string[] = [];
    const writeOutput = function (text: string, tab: number = 0) {
        output.push("".padStart(tab * 4, " ") + text);
    }

    for(const connection of connections) {
        const conn = await createConnection(connection);
        const rows = await conn.query(`SHOW DATABASES;`);
        const dbs = rows
            .map((row: Record<string, string>) => row.Database)
            .filter((db: string) => db !== 'information_schema'); // performance_schema // sys


        // Список баз данных
        for(const db of dbs) {
            writeOutput(`export namespace ${db} {`, 0);
            await conn.query(`USE ${db};`);
            const rows = await conn.query(`SHOW TABLES;`);
            const tables = rows.map((row: Record<string, any>) => Object.values(row)[0]);

            for(const table of tables) {
                writeOutput(`export interface ${table} {`, 1);
                const columns = await conn.query(`DESCRIBE ${table};`);

                for(const column of columns) {
                    writeOutput(`${column.Field}:${convertType(column.Type)};`, 2);
                }
                writeOutput(`}`, 1);
            }
            writeOutput(`}`, 0);
            writeOutput("\n");
        }

        // Закрываем подключение к базе
        await conn.end();
    }

    const str = output.join("\n");
    fs.writeFileSync(defaultOutputFile, str, {
        encoding: "utf-8"
    });
})();









