import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import margv from "margv"; // Чтение из командной строки
import mariadb from "mariadb"; // Работа с базой данных
import chalk from "chalk";
import * as process from "process"; // Подсветка в консоли

import type {dbspace} from "@/types";

// Данные из командной строки
const defaultConfigFile = './dbspace.json';

// --config -c configFile.json
const argv = margv();
const configFile = argv.config || argv.c || defaultConfigFile;

// TODO Чтение файла конфигураци если он есть

// Получаем конфигурацию и проводим нормализацию
// Читаем выбранные базы данных и создаем обект
// По объекту строим файл интерфейсов

let conf: dbspace.Config = {
    connections: []
};
const baseDir = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(baseDir, configFile);

try {
    // Если ошибка
    conf = JSON.parse(fs.readFileSync(filePath, {
        encoding: "utf-8"
    }));

} catch (e) {
    console.log(chalk.red("Ошибка. Файл конфигурации ") + chalk.bold(filePath) + chalk.red(" не найден."));
    process.exit(0);
}

conf.file = argv.file || argv.f || conf.file || "./dbspace.ts";

// console.log(conf);

const connections = conf.connections;

// Основной цикл подключений
for(const connection of connections) {

}



