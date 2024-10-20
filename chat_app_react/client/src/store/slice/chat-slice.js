
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],

  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),

  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [...channels, channel] });
  },

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    // Vérifiez que le message est bien formé avant de l'ajouter.
    if (
      !message ||
      !message.sender ||
      (selectedChatType === "contact" && !message.recipient)
    ) {
      console.warn("Invalid message received, skipping:", message);
      return;
    }

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient?._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },

  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },

addContactInDMContact: (message) => {
  const userId = get().userInfo.id;

  // Déterminer le contact à partir de l'ID du message.
  const fromId =
    message.sender._id === userId
      ? message.recipient._id
      : message.sender._id;

  const fromData =
    message.sender._id === userId ? message.recipient : message.sender;

  // Récupérer la liste des contacts existants.
  let dmContacts = get().directMessagesContacts;

  // Vérifier si le contact existe déjà dans la liste.
  const index = dmContacts.findIndex((contact) => contact._id === fromId);

  // Si le contact est déjà présent, le retirer pour le remettre en tête de liste.
  if (index !== -1) {
    dmContacts = dmContacts.filter((contact) => contact._id !== fromId);
  }

  // Ajouter le contact en tête de liste.
  dmContacts.unshift(fromData);

  // Mettre à jour l'état avec la liste de contacts modifiée.
  set({ directMessagesContacts: dmContacts });
},

});
