import { Schema, Types, model } from 'mongoose';

export interface ISubscription {
  subscriber: Types.ObjectId;
  channel: Types.ObjectId;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Subscription = model('Subscription', subscriptionSchema);
