const { Vendor, Branch, Payment, Subscription } = require('./models');

module.exports = {
  sequelize,
  Sequelize,
  models: {
    Vendor,
    Branch,
    Payment,
    Subscription
  },
  associations: function() {
    Vendor.hasMany(Branch, { foreignKey: 'vendor_id' });
    Vendor.hasMany(Payment, { foreignKey: 'vendor_id' });
    Vendor.hasMany(Subscription, { foreignKey: 'vendor_id' });

    Branch.belongsTo(Vendor, { foreignKey: 'vendor_id' });
    Payment.belongsTo(Vendor, { foreignKey: 'vendor_id' });
    Subscription.belongsTo(Vendor, { foreignKey: 'vendor_id' });
  }
};
