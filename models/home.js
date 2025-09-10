module.exports = (sequelize, Sequelize) => {
    const Home = sequelize.define('Home', {
        ParticipantEmail: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            references: { model: 'Participants', key: 'email' }
        },
        country: Sequelize.DataTypes.STRING,
        city: Sequelize.DataTypes.STRING,
        deleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },{
        timestamps: true
    });
    Home.associate = function(models) {
        Home.belongsTo(models.Participant, { foreignKey: 'ParticipantEmail', targetKey: 'email', onDelete: 'CASCADE' })
    };
	return Home
}