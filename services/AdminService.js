const { Op } = require("sequelize");
class AdminService {
    constructor(db) {
        this.client = db.sequelize;
        this.Admin = db.Admin;
        this.isPopulated = false;
    }
    
    async findOne(login) {        
        return await this.Admin.findOne({
            where: {login} 
        });
    }

    async populateDatabase(login, password, salt, role) {
        await this.Admin.create({ login, password, salt, role })
    }
}
module.exports = AdminService;