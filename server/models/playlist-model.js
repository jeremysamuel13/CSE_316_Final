const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    songs: {
      type: [
        {
          title: String,
          artist: String,
          youTubeId: String,
        },
      ],
      required: true,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    dislikes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
    isPublished: { type: Boolean, default: false, required: true },
    publishDate: Date,
    listens: { type: Number, default: 0, required: true },
    comments: {
      type: [
        {
          comment: String,
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
