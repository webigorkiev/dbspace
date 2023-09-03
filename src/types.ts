export namespace dbspace {
    interface Connection {
        type: "mysql"|"mariadb"|"manticore",
        host: string,
        port: number,
        user: string,
        password: string,
        dbs: string[],
        tables: string[]
    }

    export interface Config {
        connections: Connection[],
        file?: string
    }
}