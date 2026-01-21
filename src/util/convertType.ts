import {dbspace} from "@/types";

// TODO "enum('test1','test2')
// Нужно добавить возможность regexp
const typesAdapters: Record<dbspace.dbType, Record<string, string>> = {
    mariadb: {

        // Numeric
        "int": "number",
        "tinyint(1)": "boolean",
        "tinyint": "number",
        "smallint": "number",
        "mediumint": "number",

        //
        "decimal": "number",
        "float": "number",
        "bit": "number",

        // Bigint
        "bigint": "string",

        // Если строка начинается с key
        "boolean": "boolean",
        "varchar": "string",
        "text": "string",
        "datetime": "string|Date",
        "longtext": "any",
        "timestamp": "number"
    },
    mysql: {

    },
    manticore: {
        "bigint": "string",
        "text": "string",
        "uint": "number",
        "string":"string",
        "tokencount": "number",
        "timestamp":"number",
        "bool":"boolean",
        "float": "number",
        "mva": "number[]",
        "json": "any"
    }
};
const regexpAdapter = [
    {
        regexp: /enum\((.*?)\)/i,
        handler: (input: string) => (input.replace(/enum\((.*?)\)/i, "$1"))
            .replace(/,/g, '|')
            .replace(/'/g, '"') + '|string'
    }
];
export const convertType = (input: string, type: dbspace.dbType, conf: Required<dbspace.Config>) => {
    const currentKeys = Object.keys(typesAdapters[type]);
    const adapter = currentKeys.includes(input) ? typesAdapters[type] : typesAdapters.mariadb;
    // Сначала ищем в пользовательском определении типов
    const customAdapter = conf?.adapter?.[type] || {};
    for(const key in customAdapter) {
        if(input.indexOf(key) === 0) {
            return adapter[key];
        }
    }
    // Далее адаптер по умолчанию
    for(const key in adapter) {
        if(input.indexOf(key) === 0) {
            return adapter[key];
        }
    }
    for(const {regexp, handler} of regexpAdapter) {
        if(regexp.test(input)) {
            return handler(input);
        }
    }
    return "string";
}