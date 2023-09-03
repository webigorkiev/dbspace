import mariadb, {ConnectionConfig} from "mariadb";

// Создание подключения к DB
export const createConnection = (opt: mariadb.ConnectionConfig): Promise<mariadb.Connection> =>  {
    return  mariadb.createConnection({...opt});
}