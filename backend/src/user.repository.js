const { client } = require("./database");
const { randomUUID } = require("crypto");

class UserRepository {
    constructor() {
        this.client = client;
    }

    async create({ name, olderCompanion, minorCompanion}) {
        const id = randomUUID();
        await this.client.query(
            "INSERT INTO USERS(ID, NAME, OLDER_COMPANION, MINOR_COMPANION) VALUES($1, $2, $3, $4)", [id, name, olderCompanion, minorCompanion]
        );
        const user = Object.assign({
            name, 
            olderCompanion,
            minorCompanion,
            id,
        });
        return user;
    }

    async findAll() {
        const { rows } = await this.client.query("SELECT * FROM USERS");
        return rows;
    }

    async update({ name, rg }, id) {
        const query = "UPDATE USERS SET NAME = $1, OLDER_COMPANION = $2, MINOR_COMPANION = $3 WHERE ID = $4";
        await this.client.query(query, [name, olderCompanion, minorCompanion, id]);
    }

    async findById(id) {
        const { rows } = await this.client.query("SELECT * FROM USERS WHERE ID = $1 LIMIT 1", [id]);

        if (rows.length > 0) {
            return rows[0];
        }

        return null;
    }

    async delete(id) {
        const query = "DELETE FROM USERS WHERE ID = $1";
        await this.client.query(query, [id]);
    }


}

module.exports = UserRepository;