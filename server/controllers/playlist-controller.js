const auth = require("../auth");
const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
  const body = req.body;
  console.log("createPlaylist body: " + JSON.stringify(body));

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Playlist",
    });
  }

  const playlist = new Playlist(body);
  console.log("playlist: " + playlist.toString());
  if (!playlist) {
    return res.status(400).json({ success: false, error: err });
  }

  User.findOne({ _id: req.userId }, (err, user) => {
    console.log("user found: " + JSON.stringify(user));
    playlist.user = user;
    user.playlists.push(playlist._id);
    user.save().then(() => {
      playlist
        .save()
        .then(() => {
          return res.status(201).json({
            playlist: playlist,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            errorMessage: "Playlist Not Created!",
          });
        });
    });
  });
};
deletePlaylist = async (req, res) => {
  console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
  console.log("delete " + req.params.id);
  Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        errorMessage: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          Playlist.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true });
          }).catch((err) => console.log(err));
        } else {
          console.log("incorrect user!");
          return res.status(400).json({
            errorMessage: "authentication error",
          });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
getPlaylistById = async (req, res) => {
  console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

  const list = await Playlist.findById({ _id: req.params.id }).populate(
    "comments.user"
  );

  if (!list.isPublished) {
    const user = await User.findOne({ email: list.ownerEmail });
    console.log("user._id: " + user._id);
    console.log("req.userId: " + req.userId);
    if (user._id != req.userId) {
      console.log("incorrect user!");
      return res
        .status(400)
        .json({ success: false, description: "authentication error" });
    }
  }

  console.log("correct user!");
  console.log(list.likes);
  return res.status(200).json({
    success: true,
    playlist: {
      ...list._doc,
      likes: list.likes.length,
      dislikes: list.dislikes.length,
      hasLiked: list.likes.some((x) => x.equals(req.userId)),
      hasDisliked: list.dislikes.some((x) => x.equals(req.userId)),
      comments: list.comments.map((c) => ({
        ...c._doc,
        user: { username: c.user.username },
      })),
    },
  });
};
getPlaylistPairs = async (req, res) => {
  console.log("getPlaylistPairs");
  await User.findOne({ _id: req.userId }, (err, user) => {
    console.log("find user with id " + req.userId);
    async function asyncFindList(email) {
      console.log("find all Playlists owned by " + email);
      await Playlist.find({ ownerEmail: email }, (err, playlists) => {
        console.log("found Playlists: " + JSON.stringify(playlists));
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        if (!playlists) {
          console.log("!playlists.length");
          return res
            .status(404)
            .json({ success: false, error: "Playlists not found" });
        } else {
          console.log("Send the Playlist pairs");
          // PUT ALL THE LISTS INTO ID, NAME PAIRS
          let pairs = [];
          for (let key in playlists) {
            let list = playlists[key];
            let pair = list.isPublished
              ? {
                  likes: list.likes.length,
                  dislikes: list.dislikes.length,
                  name: list.name,
                  _id: list._id,
                  publishDate: list.publishDate,
                  listens: list.listens,
                  isPublished: list.isPublished,
                  username: user.username,
                  hasLiked: list.likes.some((x) => x.equals(req.userId)),
                  hasDisliked: list.dislikes.some((x) => x.equals(req.userId)),
                }
              : {
                  _id: list._id,
                  name: list.name,
                  username: user.username,
                };
            pairs.push(pair);
          }
          return res.status(200).json({ success: true, idNamePairs: pairs });
        }
      }).catch((err) => console.log(err));
    }
    asyncFindList(user.email);
  }).catch((err) => console.log(err));
};
getPlaylists = async (req, res) => {
  const playlists = await Playlist.find({}).populate("comments.user");
  if (!playlists.length) {
    return res
      .status(404)
      .json({ success: false, error: `Playlists not found` });
  }
  return res.status(200).json({
    success: true,
    data: playlists.map(({ _doc: { likes, dislikes, comments, ...pl } }) => ({
      ...pl,
      likes: likes.length,
      dislikes: dislikes.length,
      hasLiked: likes.some((x) => x.equals(req.userId)),
      hasDisliked: dislikes.some((x) => x.equals(req.userId)),
      comments: comments.map((c) => ({
        ...c._doc,
        user: { username: c.user.username },
      })),
    })),
  });
};
updatePlaylist = async (req, res) => {
  const body = req.body;
  console.log("updatePlaylist: " + JSON.stringify(body));
  console.log("req.body.name: " + req.body.name);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        err,
        message: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          console.log("req.body.name: " + req.body.name);

          list.name = body.playlist.name;
          list.songs = body.playlist.songs;
          list
            .save()
            .then(() => {
              console.log("SUCCESS!!!");
              return res.status(200).json({
                success: true,
                id: list._id,
                message: "Playlist updated!",
              });
            })
            .catch((error) => {
              console.log("FAILURE: " + JSON.stringify(error));
              return res.status(404).json({
                error,
                message: "Playlist not updated!",
              });
            });
        } else {
          console.log("incorrect user!");
          return res
            .status(400)
            .json({ success: false, description: "authentication error" });
        }
      });
    }
    asyncFindUser(playlist);
  });
};

const getPublishedPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ isPublished: true }).populate("user");

  if (!playlists) {
    console.log("!playlists.length");
    return res
      .status(404)
      .json({ success: false, error: "Playlists not found" });
  }

  const userId = auth.verifyUser(req);

  const mapped = playlists.map(
    ({
      likes,
      dislikes,
      name,
      _id,
      publishDate,
      listens,
      user,
      isPublished,
      comments,
    }) => ({
      likes: likes.length,
      dislikes: dislikes.length,
      name,
      _id,
      publishDate,
      listens,
      isPublished,
      hasLiked: userId ? likes.some((x) => x.equals(userId)) : undefined,
      hasDisliked: userId ? dislikes.some((x) => x.equals(userId)) : undefined,
      username: user.username,
      comments: comments.map((c) => ({
        ...c._doc,
        user: { username: c.user.username },
      })),
    })
  );

  console.log(`Published playlists: ${mapped}`);

  return res.status(200).json({ success: true, data: mapped });
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment || !id) {
    return res.status(400).json({
      success: false,
      description: `no ${!comment ? "comment" : "id"} supplied`,
    });
  }

  const cl = await User.findById(req.userId);

  const playlist = await Playlist.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: { comment, user: cl },
      },
    },
    { new: true }
  );

  if (!playlist) {
    return res
      .status(404)
      .json({ success: false, description: "playlist not found" });
  }

  const c = playlist.comments.at(-1);

  return res.status(200).json({
    success: true,
    data: {
      ...c._doc,
      user: { username: cl.username },
    },
  });
};

const publishPlaylist = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      description: `no id supplied`,
    });
  }

  let playlist = await Playlist.findById(id).populate("user");

  if (!playlist) {
    console.log("doesnt exist");
    return res
      .status(404)
      .json({ success: false, description: "playlist not found" });
  }

  if (playlist.user._id != req.userId) {
    console.log("incorrect user!");
    return res.status(400).json({
      errorMessage: "authentication error",
    });
  }

  if (playlist.isPublished) {
    console.log("already published");
    return res
      .status(409)
      .json({ success: false, description: "playlist already published" });
  }

  playlist.isPublished = true;
  playlist.publishDate = new Date();

  playlist = await playlist.save();

  console.log("set published");

  const {
    likes,
    dislikes,
    name,
    _id,
    publishDate,
    listens,
    user,
    isPublished,
  } = playlist;

  return res.status(200).json({
    success: true,
    data: {
      likes: likes.length,
      dislikes: dislikes.length,
      name,
      _id,
      publishDate,
      listens,
      isPublished,
      hasLiked: likes.some((x) => x.equals(req.userId)),
      hasDisliked: dislikes.some((x) => x.equals(req.userId)),
      username: user.username,
    },
  });
};

const likePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      description: `no id supplied`,
    });
  }

  let playlist = await Playlist.findById(id).populate("user");

  if (!playlist) {
    return res
      .status(404)
      .json({ success: false, description: "playlist not found" });
  }

  if (!playlist.isPublished) {
    return res
      .status(409)
      .json({ success: false, description: "playlist already published" });
  }

  const cl = await User.findById(req.userId);

  !playlist.likes.includes(cl) && playlist.likes.push(cl);
  playlist.dislikes = playlist.dislikes.filter((x) => !x.equals(cl._id));

  playlist = await playlist.save();

  const {
    likes,
    dislikes,
    name,
    _id,
    publishDate,
    listens,
    user,
    isPublished,
  } = playlist;
  return res.status(200).json({
    success: true,
    data: {
      likes: likes.length,
      dislikes: dislikes.length,
      name,
      _id,
      publishDate,
      listens,
      isPublished,
      hasLiked: likes.some((x) => x.equals(cl._id)),
      hasDisliked: dislikes.some((x) => x.equals(cl._id)),
      username: user.username,
    },
  });
};

const dislikePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      description: `no id supplied`,
    });
  }

  let playlist = await Playlist.findById(id).populate("user");

  if (!playlist) {
    return res
      .status(404)
      .json({ success: false, description: "playlist not found" });
  }

  if (!playlist.isPublished) {
    return res
      .status(409)
      .json({ success: false, description: "playlist already published" });
  }

  const cl = await User.findById(req.userId);

  !playlist.dislikes.includes(cl) && playlist.dislikes.push(cl);
  playlist.likes = playlist.likes.filter((x) => !x.equals(cl._id));

  playlist = await playlist.save();
  const {
    likes,
    dislikes,
    name,
    _id,
    publishDate,
    listens,
    user,
    isPublished,
  } = playlist;
  return res.status(200).json({
    success: true,
    data: {
      likes: likes.length,
      dislikes: dislikes.length,
      name,
      _id,
      publishDate,
      listens,
      isPublished,
      hasLiked: likes.some((x) => x.equals(cl._id)),
      hasDisliked: dislikes.some((x) => x.equals(cl._id)),
      username: user.username,
    },
  });
};

const listen = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      description: `no id supplied`,
    });
  }

  let playlist = await Playlist.findById(id);

  if (!playlist) {
    return res
      .status(404)
      .json({ success: false, description: "playlist not found" });
  }

  if (!playlist.isPublished) {
    return res
      .status(409)
      .json({ success: false, description: "playlist already published" });
  }

  playlist.listens++;

  playlist = await playlist.save();

  const {
    likes,
    dislikes,
    name,
    _id,
    publishDate,
    listens,
    user,
    isPublished,
  } = playlist;
  return res.status(200).json({
    success: true,
    data: {
      likes: likes.length,
      dislikes: dislikes.length,
      name,
      _id,
      publishDate,
      listens,
      isPublished,
      hasLiked: likes.some((x) => x.equals(req.userId)),
      hasDisliked: dislikes.some(x.equals(req.userId)),
      username: user.username,
    },
  });
};

module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylistPairs,
  getPlaylists,
  updatePlaylist,
  getPublishedPlaylists,
  addComment,
  publishPlaylist,
  likePlaylist,
  dislikePlaylist,
  listen,
};
