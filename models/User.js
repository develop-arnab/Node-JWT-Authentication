import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        refreshtoken: { type: String, required: false }
	},
	{ collection: 'users' }
)
export default mongoose.model('UserSchema', UserSchema)
// const model = mongoose.model('UserSchema', UserSchema)

// module.exports = model
