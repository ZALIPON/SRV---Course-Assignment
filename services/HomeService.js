class HomesService {
    constructor(db) {
        this.client = db.sequelize;
        this.Home = db.Home;
        this.Participant = db.Participant;
    }

    async create(country, city, email, t ) {
            await this.Home.create({ country, city, ParticipantEmail: email }, { transaction: t });
    }

    async findOne(email){
        return await this.Home.findOne({
            where: { ParticipantEmail: email }
        })
    }

    async findAll(){
        return await this.Home.findAll({})
    }

    async homeDetails(email){
        return await this.Home.findOne({
            attributes: [ 'country', 'city' ],
            where: { ParticipantEmail: email, deleted: false }
            
        })
    }

    async update(  sEmail, country, city, email, t ){
        return await this.Home.update(
            { country, city, ParticipantEmail: email },
            {
                where: {
                    ParticipantEmail: sEmail
                },
                transaction: t ,
            },
        )
    }
}

module.exports = HomesService