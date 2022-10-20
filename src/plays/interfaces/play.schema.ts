import * as mongoose from 'mongoose';

export const ResultSchema = new mongoose.Schema({
  set: { type: String },
});

export const PlaySchema = new mongoose.Schema(
  {
    category: { type: String },
    players: [{ type: mongoose.Types.ObjectId, ref: 'Player' }],
    def: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    result: [ResultSchema],
  },
  { timestamps: true, collection: 'plays' },
);
