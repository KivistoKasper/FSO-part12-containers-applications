const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sequelize = new Sequelize('sqlite:db/database.sqlite', {
  logging: false,
});

const Threshold = sequelize.define(
  'Threshold',
  {
    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      set(value) {
        this.setDataValue('threshold', value);
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    timestamps: false,
  },
);

const Interval = sequelize.define(
  'Interval',
  {
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      set(value) {
        this.setDataValue('interval', value);
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    timestamps: false,
  },
);

const Emote = sequelize.define(
  'Emote',
  {
    emote: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAnalyzed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaulValue: false,
    }
  },
  {
    sequelize,
    tableName: 'Emotes',
    timestamps: false,
  },
);

const AllowedEmote = sequelize.define(
  'AllowedEmote',
  {
    emote: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    isAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'AllowedEmotes',
    timestamps: false,
  },
);

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  },
);

const createDefaultValues = async () => {
  if (await Threshold.count() === 0) {
    await Threshold.create({
      threshold: 10,
    });
  }
  if (await Interval.count() === 0) {
    await Interval.create({
      interval: 100,
    });
  }
  if (await AllowedEmote.count() === 0) {

    const defaultAllowedEmotes = [
      { emote: "❤️", isAllowed: true },
      { emote: "👍", isAllowed: true },
      { emote: "😢", isAllowed: true },
      { emote: "😡", isAllowed: true}
    ];

    await AllowedEmote.bulkCreate(defaultAllowedEmotes);
  }
  if (await User.count() === 0) {
    await User.create({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD });
  }
}
    
module.exports = { sequelize, createDefaultValues, Threshold, Interval, Emote, AllowedEmote, User };
