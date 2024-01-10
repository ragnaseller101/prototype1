const mongoose = require("mongoose");
const Client = require("./client");
const Users = require("./user");
const Skins = require("./skin");
const Prices = require("./price");
const Version = require("./version");
const Buddies = require("./buddy");
const PlayerCards = require("./playercard");
const PlayerTitles = require("./playertitle");
const Sprays = require("./spray");
const { db_url } = require("../config");
// additional connection options
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
};

module.exports = {
	connect: async () => {
		try {
			await mongoose.connect(db_url, options).then(() => {
				console.log("Connected to Database")
			});
		} catch (err) {
			console.log("Error: " + err);
		}
	},

	getDatabaseStatus: () => {
		return mongoose.connection.readyState;
	},

	Users: {
		save: async (value) => {
			const user = {
				id: value.id,
				puuid: value.puuid,
				auth: value.auth,
				username: value.username,
				region: value.region
			}

			let existing = await Users.findOne({id: user.id});
			if (existing) {
				existing.users.push(user);
				return await existing.save();
			}
			else {
				const users = new Users({
					id: user.id,
					users: [user]
				})
				return await users.save();
			}
		},

		find: async (filter) => {
			if (filter) {
				return Users.find(filter);
			}
			else {
				return Users.find({});
			}
		},

		findOne: async (filter) => {
			return Users.findOne(filter);
		},

		updateOne: async (filter, update) => {
			return Users.updateOne(filter, update);
		},

		deleteOne: async (filter) => {
			return Users.deleteOne(filter);
		},
	},

	ValorantVersion: {
		get: async () => {
			value = await Version.findOne({});
			return value;
		},

		update: async (filter, update) => {
			return Version.updateOne(filter, update);
		},
	},

	Skins: {
		insertMany: async (array) => {
			await Skins.insertMany(array);
		},

		findOne: async (filter) => {
			return Skins.findOne(filter);
		},

		clear: async () => {
			await Skins.deleteMany({});
		}
	},

	Prices: {
		insertMany: async (array) => {
			await Prices.insertMany(array);
		},

		findOne: async (filter) => {
			return Prices.findOne(filter);
		},

		clear: async () => {
			await Prices.deleteMany({});
		}
	},

	Client: {
		add: async () => {
			const temp = new Client({
				serverDown: false,
				lastServerDown: new Date(0),
				status: "Online",
				activity: {
					name: "ur heart <3",
					type: "PLAYING"
				}
			});

			await temp.save();

		},

		get: async () => {
			value = await Client.findOne({});
			return value;
		},

		update: async (filter, update) => {
			return Client.updateOne(filter, update);
		},
	},

	Buddies: {
		insertMany: async (array) => {
			await Buddies.insertMany(array);
		},

		findOne: async (filter) => {
			return Buddies.findOne(filter);
		},

		clear: async () => {
			await Buddies.deleteMany({});
		}
	},

	PlayerCards: {
		insertMany: async (array) => {
			await PlayerCards.insertMany(array);
		},

		findOne: async (filter) => {
			return PlayerCards.findOne(filter);
		},

		clear: async () => {
			await PlayerCards.deleteMany({});
		}
	},

	PlayerTitles: {
		insertMany: async (array) => {
			await PlayerTitles.insertMany(array);
		},

		findOne: async (filter) => {
			return PlayerTitles.findOne(filter);
		},

		clear: async () => {
			await PlayerTitles.deleteMany({});
		}
	},

	Sprays: {
		insertMany: async (array) => {
			await Sprays.insertMany(array);
		},

		findOne: async (filter) => {
			return Sprays.findOne(filter);
		},

		clear: async () => {
			await Sprays.deleteMany({});
		}
	},
}



