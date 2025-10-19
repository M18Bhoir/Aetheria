import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question for the poll.'],
        trim: true,
    },
    options: [{
        text: {
            type: String,
            required: [true, 'Please provide text for each option.'],
        },
        votes: {
            type: Number,
            default: 0,
        },
    }, ],
    // This creates a reference to the User who created the poll.
    // It stores the ObjectId of the user document.
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    // This option automatically adds `createdAt` and `updatedAt` fields
    // to your schema, which is useful for tracking when documents are
    // created and modified.
    timestamps: true
});

const Poll = mongoose.model('Poll', PollSchema);

export default Poll;

