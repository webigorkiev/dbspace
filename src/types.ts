export namespace dbspace {
    interface Connection {
        type: string,
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