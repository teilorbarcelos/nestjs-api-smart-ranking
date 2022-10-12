import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true },
    name: { type: String, unique: true },
    ranking: String,
    rankingPosition: Number,
    imageUrl: String,
  },
  { timestamps: true, collection: 'players' },
);
