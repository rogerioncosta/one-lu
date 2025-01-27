const UserRepository = require("./user.repository");

class User {
    constructor() {
        this.users = [];
        this.userRepository = new UserRepository();
    }

    async create(body) {
        const user = await this.userRepository.create(body);
        return user;
    }

    async findAll() {
        return this.userRepository.findAll();
    }

    async update(body, id) {
        // const userIndex = this.users.findIndex((user) => user.id === id);
        const userExists = await this.userRepository.findById(id);

        if (!userExists) {
            throw new Error("Convidado não encontrado!");
        }

        // // Alterar o convidado (ID permance)
        // this.users[userIndex] = {
        //     ...body,
        //     id,
        // };
        await this.userRepository.update(body, id);
    }

    async delete(id) {
        const userExists = await this.userRepository.findById(id);

        if (!userExists) {
            throw new Error("Convidado não encontrado!");
        }
        await this.userRepository.delete(id);
    }

}

module.exports = new User();