const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    duration: {
        type: Number,
        default: 25,
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: 'Duration must be greater than 0'
        }
    },
    sessionType: {
        type: String,
        enum: ['work', 'break'],
        default: 'work'
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [500, 'Notes cannot be more than 500 characters']
    }
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;