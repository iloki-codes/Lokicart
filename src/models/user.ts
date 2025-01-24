import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female" | "lgbtq+" | "others";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;

    age: number; //virtual
}


const schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "Please Enter ID"],
        },
        name: {
            type: String,
            required: [true, "Please enter name"],
        },
        email: {
            type: String,
            requied: [true, "Please enter email"],
            unique: [true, "Email already exists"],
            validate: validator.default.isEmail,
        },
        photo: {
            type: String,
            required: [true, "Please add a photo"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        gender: {
            type: String,
            enum: ["male", "female", "lgbtq+", "others"],
            required: [true, "Pleadse enter gender"],
        },
        dob: {
            type: Date,
            required: [true, "Please enter Date Of Birth"],
        },
    },
    {
        timestamps: true,
    }
);


schema.virtual("age").get(function() 
    {
        const today = new Date();
        const dob = this.dob;
        let age = today.getFullYear() - dob.getFullYear();

        if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        {
            age--;
        }
        return age;
    }
)

export const User = mongoose.model<IUser>("User", schema);