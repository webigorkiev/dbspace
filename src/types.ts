export namespace dbspace {
    export type dbType = "mysql"|"mariadb"|"manticore";
    interface Connection {
        type?: dbType, // default mariadb
        host?: string, // deafult localhost
        port?: number, // 3306
        user?: string,
        password?: string,
        dbs?: string[], // Список баз данных
        tables?: string[] // Список таблиц
    }

    export interface Config {
        connections?: Connection[],
        file?: string,
        adapter?: Record<string, Record<string, string>>// Можно указать дополнительные правила преобразования типов
    }
}