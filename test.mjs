// import chalk from "chalk";
//
// console.log("++++++++++++");
// console.log("+----------+");
// console.log("+----------+");
// console.log("+---RR-----+");
// console.log("+----------+");
// console.log("+----------+");
// console.log("+----------+");
// console.log("++++++++++++");

// class
class Liza {
    name = "Liza";
    age = 14;

    tellAboutMySelf() {
        console.log(this.name, this.age);
    }
}

const instOfLiza = new Liza();
instOfLiza.tellAboutMySelf();

const instOfLiza2 = {
    name: "Liza",
    age: 14,

    tellAboutMySelf() {
        console.log(this.name, this.age);
    }
}

instOfLiza2.tellAboutMySelf();

const client = {
    name: "Liza",
    age: 14,
    marred: false,
    brothers: [
        {
            name: "Mark",
            age: 10
        }
    ]
}

const getClient = () => {
    return client;
}