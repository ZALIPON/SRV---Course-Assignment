module.exports = (sequelize, Sequelize) => {
    const Work = sequelize.define('Work', {
        ParticipantEmail: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            references: { model: 'Participants', key: 'email' }
        },
        companyname: Sequelize.DataTypes.STRING,
        salary: {
            type: Sequelize.DataTypes.DECIMAL(12,2),
        },
        currency: Sequelize.DataTypes.STRING,
        deleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        timestamps: false
    });
    Work.associate = function(models) {
        Work.belongsTo(models.Participant, { foreignKey: 'ParticipantEmail', targetKey: 'email', onDelete: 'CASCADE' })
    };
    
	return Work
}