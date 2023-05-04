import * as fs from "fs";

import margv from "margv"; // Чтение из командной строки
import mariadb from "mariadb"; // Работа с базой данных
import chalk from "chalk"; // Подсветка в консоли

// Данные из командной строки
const defaultConfigFile = 'dbspace.json';

// --config -c configFile.json
const argv = margv();
const configFile = argv.config || argv.c || defaultConfigFile;

// TODO Чтение файла конфигураци если он есть

// Получаем конфигурацию и проводим нормализацию
// Читаем выбранные базы данных и создаем обект
// По объекту строим файл интерфейсов

console.log(configFile);

