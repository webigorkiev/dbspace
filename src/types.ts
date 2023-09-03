export namespace dbspace {
    interface Connection {
        type?: "mysql"|"mariadb"|"manticore", // default mariadb
        host?: string, // deafult localhost
        port?: number, // 3306
        user?: string,
        password?: string,
        dbs?: string[], // Список баз данных
        tables?: string[] // Список таблиц
    }

    export interface Config {
        connections?: Connection[],
        file?: string
    }
}