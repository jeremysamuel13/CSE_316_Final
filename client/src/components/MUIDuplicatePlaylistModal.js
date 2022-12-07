import React from "react";

const MUIDuplicatePlaylistModal = () => {
  const { store } = useContext(GlobalStoreContext);
  let name = "";
  if (store.listMarkedForDeletion) {
    name = store.listMarkedForDeletion.name;
  }
  function handleDeleteList(event) {
    store.deleteMarkedList();
  }
  function handleCloseModal(event) {
    store.unmarkListForDeletion();
  }

  return (
    <Modal open={store.isDeleteListModalOpen()}>
      <Box sx={style}></Box>
    </Modal>
  );
};

export default MUIDuplicatePlaylistModal;
