module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define('Admin', {
        login: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false            
        },
        salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false            
        },
        role: {
           type: Sequelize.DataTypes.STRING,
           defaultValue: "Admin" 
        }
    },{
        timestamps: false
    });
	return Admin
}