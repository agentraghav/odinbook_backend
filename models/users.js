const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String },
    description: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    profile_photo: {
      type: String,
      default:
        'data:image/jpeg;base64,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',
    },
    cover_photo: { type: String },
    password: { type: String },
    display_name: { type: String },
    facebookID: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    photos: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('full_name').get(function () {
  return this.firstname + ' ' + this.lastname;
});

module.exports = mongoose.model('User', userSchema);
