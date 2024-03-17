import moongose from "mongoose";

const profileSchema = new moongose.Schema({
  user: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
  },
  photo: {
    type: String,
  },
  bio: {
    type: String,
  },
  phone: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default moongose.model("Profile", profileSchema);
