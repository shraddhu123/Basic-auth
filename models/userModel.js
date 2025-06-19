import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['Admin', 'User','SuperAdmin'],
            default: 'User'
        },
    },{
        timestamps:true
    }
)

const User= mongoose.model("User",userSchema)

export default User