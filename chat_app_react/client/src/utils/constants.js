export const HOST= import.meta.env.VITE_SERVER_URL;


export const AUTH_ROUTES="api/auth";
export const SIGNUP_ROUTE=`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE=`${AUTH_ROUTES}/login`;
export const GET_USER_INFO=`${AUTH_ROUTES}/userInfo`;
export const UPDATE_PROFIL_ROUTE=`${AUTH_ROUTES}/updateProfil`;
export const UPDATE_IMAGE_PROFIL_ROUTE=`${AUTH_ROUTES}/updateProfilImage`;
export const REMOVE_PROFIL_IMAGE=`${AUTH_ROUTES}/remove-profil-image`;
export const LOGOUT=`${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTE= "api/contacts";
export const SEARCH_CONTACT_ROUTE=`${CONTACT_ROUTE}/search`;
export const GET_ALL_CONTACT_FOR_DM=`${CONTACT_ROUTE}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTE=`${CONTACT_ROUTE}/get-all-contacts`;


export const MESSAGE_ROUTE='api/messages';
export const GET_ALL_MESSAGES_ROUTE=`${MESSAGE_ROUTE}/get-messages`;
export const UPLOAD_FILE=`${MESSAGE_ROUTE}/upload/files`;


export const CHANNEL_ROUTE='api/channel';
export const CREATED_CHANNEL_ROUTE=`${CHANNEL_ROUTE}/create-channel`;
export const GET_USERS_CHANNELS_ROUTE=`${CHANNEL_ROUTE}/get-user-channels`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTE}/channel`;
