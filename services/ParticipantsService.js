class ParticipantsService {
    constructor(db) {
        this.client = db.sequelize;
        this.Participant = db.Participant;
    }

    async create(email, firstname, lastname, dob, t) {
        const exists = await this.Participant.findOne({ where: { email } });
        if (!exists) {
            await this.Participant.create({ email, firstname, lastname, dob }, { transaction: t, });
        }
    }

    async findOne(email){
        return await this.Participant.findOne({
            where: {email}
        })
    }

    async findAll(){
        return await this.Participant.findAll({})
    }

    async details(){
        return await this.Participant.findAll({
            attributes: [ 'email', 'firstname', 'lastname' ]
        });
    }

    async emailDetails(email){
        return await this.Participant.findOne({
            attributes: [ 'firstname', 'lastname', 'dob' ],
            where: { email }
        });
    }

    async delete(email){
        return await this.Participant.destroy({
            where: { email }
        })
    }

    async update(sEmail, fields, t){
        return await this.Participant.update(
            fields,
            {
                where: {
                    email: sEmail
                },
                transaction: t,
            },
        )
    }
}

module.exports = ParticipantsService