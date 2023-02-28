import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

interface UserAttrs {
    email: string;
    password: string;
}

const User = mongoose.model('User', userSchema);

const buildUser = (attrs: UserAttrs) => {
    return new User(attrs);
};

export { User, buildUser };