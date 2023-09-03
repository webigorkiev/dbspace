const typesAdapters = {

    // Если строка начинается с key
    "tinyint(1)": "boolean",
    "boolean":"boolean",
    "int": "number",
    "varchar": "string",
    "text":"string",
    "datetime": "string|Date",
    "longtext": "any"
};

export const convertType = (input: string) => {
    for(const key in typesAdapters) {
        if(input.indexOf(key) === 0) {
            return typesAdapters[key];
        }
    }

    return "string";
}