import mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    date: { type: Date },
    status: { type: String },
    solicitationDate: { type: Date },
    answerDate: { type: Date },
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    play: { type: mongoose.Schema.Types.ObjectId, ref: 'Play' },
  },
  { timestamps: true, collection: 'challenges' },
);
