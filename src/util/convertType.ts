const typesAdapters = {

    // Numeric
    "int": "number",
    "tinyint(1)": "boolean",

    // Если строка начинается с key
    "boolean":"boolean",
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