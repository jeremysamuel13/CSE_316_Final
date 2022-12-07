/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require("express");
const PlaylistController = require("../controllers/playlist-controller");
const router = express.Router();
const auth = require("../auth");

router.delete("/playlist/:id", auth.verify, PlaylistController.deletePlaylist);
router.get("/playlist/:id", auth.verify, PlaylistController.getPlaylistById);
router.put("/playlist/:id", auth.verify, PlaylistController.updatePlaylist);

router.get("/playlistpairs", auth.verify, PlaylistController.getPlaylistPairs);

router.get("/playlists", auth.verify, PlaylistController.getPlaylists);

router.post("/playlist", auth.verify, PlaylistController.createPlaylist);

router.get("/published", PlaylistController.getPublishedPlaylists);

router.put("/published/:id", auth.verify, PlaylistController.publishPlaylist);
router.post(
  "/published/:id/comment",
  auth.verify,
  PlaylistController.addComment
);
router.put(
  "/published/:id/dislike",
  auth.verify,
  PlaylistController.dislikePlaylist
);
router.put("/published/:id/like", auth.verify, PlaylistController.likePlaylist);
router.post("/published/:id/listen", PlaylistController.listen);

module.exports = router;
