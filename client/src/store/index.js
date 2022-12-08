import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import jsTPS from "../common/jsTPS";
import api from "./store-request-api";
import CreateSong_Transaction from "../transactions/CreateSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import UpdateSong_Transaction from "../transactions/UpdateSong_Transaction";
import AuthContext from "../auth";
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  SET_PUBLISHED_PLAYLISTS: "SET_PUBLISHED_PLAYLISTS",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
  HIDE_MODALS: "HIDE_MODALS",
  SET_CURRENT_SONG: "SET_CURRENT_SONG",
  SET_PUBLISHED: "SET_PUBLISHED",
  DUPLICATE_PLAYLIST: "DUPLICATE_PLAYLIST",
  SYNC_LOCAL_CHANGE: "SYNC_LOCAL_CHANGE",
  SET_SEARCH: "SET_SEARCH",
};

export const SortType = {
  NAME: "name",
  DATE: "date",
  LISTENS: "listens",
  LIKES: "likes",
  DISLIKES: "dislikes",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
  NONE: "NONE",
  DELETE_LIST: "DELETE_LIST",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
  DUPLICATE_PLAYLIST: "DUPLICATE_PLAYLIST",
};

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,
    idNamePairs: [],
    currentList: null,
    currentSongIndex: -1,
    currentSong: null,
    listNameActive: false,
    listIdMarkedForDeletion: null,
    listMarkedForDeletion: null,
    publishedPlaylists: [],
    published: false,
    search: "",
    sort: null,
  });
  const history = useHistory();

  console.log("inside useGlobalStore");

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);
  console.log("auth: " + auth);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          currentList: payload.playlist,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          idNamePairs: payload,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.DELETE_LIST,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: payload.id,
          listMarkedForDeletion: payload.playlist,
        }));
      }
      // UNMARK LIST DELETE
      case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
        return setStore((st) => ({
          ...st,
          currentModal: null,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          listNameActive: true,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      //
      case GlobalStoreActionType.EDIT_SONG: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.EDIT_SONG,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      case GlobalStoreActionType.REMOVE_SONG: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.REMOVE_SONG,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      case GlobalStoreActionType.HIDE_MODALS: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.NONE,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        }));
      }
      case GlobalStoreActionType.LOAD_PUBLISHED_PLAYLISTS: {
        return setStore((st) => ({ ...st, publishedPlaylists: payload }));
      }
      case GlobalStoreActionType.SET_CURRENT_SONG: {
        return setStore((st) => ({ ...st, ...payload }));
      }
      case GlobalStoreActionType.SET_PUBLISHED: {
        return setStore((st) => ({ ...st, published: payload }));
      }
      case GlobalStoreActionType.DUPLICATE_PLAYLIST: {
        return setStore((st) => ({
          ...st,
          currentModal: CurrentModal.DUPLICATE_PLAYLIST,
        }));
      }
      case GlobalStoreActionType.SYNC_LOCAL_CHANGE: {
        return setStore((st) => ({ ...st }));
      }
      case GlobalStoreActionType.SET_SEARCH: {
        return setStore((st) => ({ ...st, search: payload }));
      }
      default:
        return store;
    }
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await api.updatePlaylistById(playlist._id, playlist);
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await api.getPlaylistPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    tps.clearAllTransactions();
  };

  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function (body) {
    store.closeCurrentList();

    let newListName = body?.name ?? "Untitled" + (store.idNamePairs.length + 1);
    const res = await api.createPlaylist({
      ...body,
      name: newListName,
      songs: body?.songs ?? [],
      ownerEmail: auth.user.email,
    });
    console.log("createNewList response: " + res);
    if (res.status === 201) {
      tps.clearAllTransactions();
      let newList = res.data.playlist;
      const response = await api.getPlaylistPairs();
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = async function () {
    const response = await api.getPlaylistPairs();
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        payload: pairsArray,
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
  // showDeleteListModal, and hideDeleteListModal
  store.markListForDeletion = function (id) {
    async function getListToDelete(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
          payload: { id: id, playlist: playlist },
        });
      }
    }
    getListToDelete(id);
  };
  store.deleteList = function (id) {
    async function processDelete(id) {
      let response = await api.deletePlaylistById(id);
      if (response.data.success) {
        store.loadIdNamePairs();
      }
    }
    processDelete(id);
  };
  store.deleteMarkedList = function () {
    store.deleteList(store.listIdMarkedForDeletion);
    store.hideModals();
  };

  store.unmarkListForDeletion = () => {
    storeReducer({
      type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
    });
  };

  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

  store.showEditSongModal = (songIndex, songToEdit) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToEdit },
    });
  };
  store.showRemoveSongModal = (songIndex, songToRemove) => {
    storeReducer({
      type: GlobalStoreActionType.REMOVE_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToRemove },
    });
  };
  store.hideModals = () => {
    storeReducer({
      type: GlobalStoreActionType.HIDE_MODALS,
      payload: {},
    });
  };
  store.isDeleteListModalOpen = () => {
    return store.currentModal === CurrentModal.DELETE_LIST;
  };
  store.isEditSongModalOpen = () => {
    return store.currentModal === CurrentModal.EDIT_SONG;
  };
  store.isRemoveSongModalOpen = () => {
    return store.currentModal === CurrentModal.REMOVE_SONG;
  };

  store.isDuplicateListModal = () => {
    return store.currentModal === CurrentModal.DUPLICATE_PLAYLIST;
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id, fromURL) {
    store.closeCurrentList(fromURL);
    async function asyncSetCurrentList(id) {
      let response = await api.getPlaylistById(id);

      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: response.data.playlist,
        });
      }
    }
    asyncSetCurrentList(id);
  };

  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };
  store.addNewSong = function () {
    let index = this.getPlaylistSize();
    this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
  };
  // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
  // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
  store.createSong = function (index, song) {
    let list = store.currentList;
    list.songs.splice(index, 0, song);
    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  store.moveSong = function (start, end) {
    let list = store.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
  // FROM THE CURRENT LIST
  store.removeSong = function (index) {
    let list = store.currentList;
    list.songs.splice(index, 1);

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
  store.updateSong = function (index, songData) {
    let list = store.currentList;
    let song = list.songs[index];
    song.title = songData.title;
    song.artist = songData.artist;
    song.youTubeId = songData.youTubeId;

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  store.addNewSong = () => {
    let playlistSize = store.getPlaylistSize();
    store.addCreateSongTransaction(
      playlistSize,
      "Untitled",
      "?",
      "dQw4w9WgXcQ"
    );
  };
  // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
  store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
    // ADD A SONG ITEM AND ITS NUMBER
    let song = {
      title: title,
      artist: artist,
      youTubeId: youTubeId,
    };
    let transaction = new CreateSong_Transaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addMoveSongTransaction = function (start, end) {
    let transaction = new MoveSong_Transaction(store, start, end);
    tps.addTransaction(transaction);
  };
  // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
  store.addRemoveSongTransaction = () => {
    let index = store.currentSongIndex;
    let song = store.currentList.songs[index];
    let transaction = new RemoveSong_Transaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addUpdateSongTransaction = function (index, newSongData) {
    let song = store.currentList.songs[index];
    let oldSongData = {
      title: song.title,
      artist: song.artist,
      youTubeId: song.youTubeId,
    };
    let transaction = new UpdateSong_Transaction(
      this,
      index,
      oldSongData,
      newSongData
    );
    tps.addTransaction(transaction);
  };
  store.updateCurrentList = function () {
    async function asyncUpdateCurrentList() {
      const response = await api.updatePlaylistById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList();
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };
  store.canAddNewSong = function () {
    return (
      store.currentList !== null && store.currentList.isPublished === false
    );
  };
  store.canUndo = function () {
    return store.currentList !== null && tps.hasTransactionToUndo();
  };
  store.canRedo = function () {
    return store.currentList !== null && tps.hasTransactionToRedo();
  };
  store.canClose = function () {
    return store.currentList !== null;
  };

  store.sort = (type) => {
    console.log(type);

    let sorted;
    switch (type) {
      case SortType.NAME:
        console.log(store.publishedPlaylists);
        sorted = store.publishedPlaylists.sort(({ name: x }, { name: y }) =>
          x.localeCompare(y)
        );

        console.log(sorted);

        break;
      case SortType.DATE:
        sorted = store.publishedPlaylists.sort(
          ({ publishedDate: x }, { publishedDate: y }) => {
            const dx = new Date(x);
            const dy = new Date(y);

            return dy - dx;
          }
        );
        break;
      case SortType.LISTENS:
        sorted = store.publishedPlaylists.sort(
          ({ listens: x }, { listens: y }) => y - x
        );
        break;
      case SortType.LIKES:
        sorted = store.publishedPlaylists.sort(
          ({ likes: x }, { likes: y }) => y - x
        );
        break;
      case SortType.DISLIKES:
        sorted = store.publishedPlaylists.sort(
          ({ dislikes: x }, { dislikes: y }) => y - x
        );
        break;
      default:
        break;
    }

    storeReducer({
      type: GlobalStoreActionType.SET_PUBLISHED,
      payload: sorted,
    });
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  store.playNext = () => {
    store.playIndex(store.currentSongIndex + 1);
  };

  store.playPrevious = () => {
    store.playIndex(store.currentSongIndex - 1);
  };

  store.playIndex = (index) => {
    const payload = {
      currentSongIndex: index,
      currentSong: store.currentList?.songs[index],
    };
    console.log(payload);
    storeReducer({
      type: GlobalStoreActionType.SET_CURRENT_SONG,
      payload,
    });
  };

  store.setPublished = (published) => {
    storeReducer({
      type: GlobalStoreActionType.SET_PUBLISHED,
      payload: published,
    });
  };

  store.loadPublishedPlaylists = async () => {
    const res = await api.getPublishedPlaylists();

    if (res.data?.success) {
      storeReducer({
        type: GlobalStoreActionType.LOAD_PUBLISHED_PLAYLISTS,
        payload: res.data.data,
      });
    } else {
      console.log("error loading published playlists");
    }
  };

  store.publishList = async (id) => {
    const res = await api.publishPlaylist(id);

    console.log(res);
    if (res.data?.success) {
      history.push("/all");
      store.loadPublishedPlaylists();
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_LIST,
        payload: res.data.data,
      });
    } else {
      console.log("error loading published playlists");
    }
  };

  store.duplicatePlaylist = async (id) => {
    storeReducer({
      type: GlobalStoreActionType.DUPLICATE_PLAYLIST,
    });
  };

  store.likePlaylist = async (id) => {
    const res = await api.like(id);
    console.log(res);
    if (!res.data?.success) {
      return false;
    }
  };

  store.dislikePlaylist = async (id) => {
    const res = await api.dislike(id);
    if (!res.data?.success) {
      return false;
    }
  };

  store.addComment = async (id, comment) => {
    const res = await api.comment(id, comment);
    return res.data?.data;
  };

  store.getFilteredPlaylist = (listType, key) => {
    let res;
    if (listType === "user") {
      res = store.idNamePairs;
    } else if (listType === "published") {
      res = store.publishedPlaylists;
    } else {
      console.log("INVALID FILTER LIST TYPE");
    }

    if (store.search.trim().length > 0) {
      res = res?.filter((val) =>
        key(val)?.toLowerCase().includes(store.search.toLowerCase())
      );
    }

    return res;
  };

  store.setSearch = (search) => {
    storeReducer({
      type: GlobalStoreActionType.SET_SEARCH,
      payload: search,
    });
  };

  store.listen = async (id) => {
    await api.listen(id);
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
