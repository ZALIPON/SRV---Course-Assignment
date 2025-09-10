module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define('Participant', {
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        firstname: Sequelize.DataTypes.STRING,
        lastname: Sequelize.DataTypes.STRING,
        dob: {
            type: Sequelize.DataTypes.STRING,
        }
    },{
        timestamps: false
    });
    Participant.associate = function(models) {
        Participant.hasOne(models.Work, { foreignKey: 'ParticipantEmail', sourceKey: 'email', onDelete: 'CASCADE', hooks: true})
        Participant.hasOne(models.Home, { foreignKey: 'ParticipantEmail', sourceKey: 'email', onDelete: 'CASCADE', hooks: true})
    };
	return Participant
}