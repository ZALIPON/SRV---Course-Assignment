class WorksService {
    constructor(db) {
        this.client = db.sequelize;
        this.Work = db.Work;
        this.Participant = db.Participant;
    }

    async create(companyname, salary, currency, email, t ) {
            await this.Work.create({ companyname, salary, currency, ParticipantEmail: email }, { transaction: t });
    }

    async findOne(email){
        return await this.Work.findOne({
            where: { ParticipantEmail: email }
        })
    }

    async findAll(){
        return await this.Work.findAll({})
    }

    async workDetails(email){
        return await this.Work.findOne({
            attributes: [ 'companyname', 'salary', 'currency' ],
            where: { ParticipantEmail: email, deleted: false }
            
        })
    }

    async update( sEmail, companyname, salary, currency, email, t ){
        return await this.Work.update(
            { companyname, salary, currency, ParticipantEmail: email },
            {
                where: {
                    ParticipantEmail: sEmail
                },
                transaction: t ,
            },
        )
    }
}

module.exports = WorksService