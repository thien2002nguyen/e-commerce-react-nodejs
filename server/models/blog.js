const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberViews: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdyaXRpbmclMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww'
    },
    author: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);