import type {dbspace} from "../types";

// Создание конфигурации
export const createConfig = (): dbspace.Config => {
    return {
        connections: [],
        file: ""
    }
}