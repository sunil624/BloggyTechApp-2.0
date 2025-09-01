const mongoose = require("mongoose");

const categorySchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        
    },
    shares: {
        type: Number,
        default:0,
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "POST",
        },
    ],
},
{
    timestamps: true,
    toJSON: {
        vurtuals: true,
    },
    toObject: {
        virtuals: true,
    }
}
);

//convert schema to model
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;