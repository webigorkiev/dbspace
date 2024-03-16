import type {dbspace} from "@/types";
import margv from "margv";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import process from "process";

const defaultConfigFile = './dbspace.json';
const defaultOutputFile = "./dbspace.ts";

export const createConfig = (): Required<dbspace.Config> => {
    // --config -c configFile.json
    const argv = margv();
    const configFile = argv.config || argv.c || defaultConfigFile;
    let conf: dbspace.Config = {
        connections: [],
        adapter: {
            mysql: {},
            mariadb: {},
            manticore: {}
        }
    };
    const filePath = path.resolve(path.resolve(), configFile);

    try {
        conf = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}));
    } catch (e) { // Если ошибка
        console.log(chalk.red("Error. Configuration file ") + chalk.bold(filePath) + chalk.red(" not found."));
        process.exit(0);
    }
    conf.file = argv.file || argv.f || conf.file || defaultOutputFile;
    return conf as Required<dbspace.Config>;
}