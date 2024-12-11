export const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:5173";
export const AUTH_ROUTES="http://localhost:8747/api/auth";
export const SINGNUP_ROUTE=`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTES=`${AUTH_ROUTES}/login`;
export const AUDIT_ROUTES="http://localhost:8747/api/auth/audit";
export const USER_INFO="http://localhost:8747/api/auth/userinfo"
export const UPDATE_PROFILE_ROUTES=`${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE=`${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE=`${AUTH_ROUTES}/logout`;


export const CONTACTS_ROUTES='http://localhost:8747/api/contacts';
export const SEACRCH_CONTACTS_ROUTES=`${CONTACTS_ROUTES}/search`;
export const GET_DMCONTACTS_ROUTES=`${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACT_ROUTES=`${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES='http://localhost:8747/api/messages/';
export const GET_ALL_MESSAGES_ROUTES=`${MESSAGES_ROUTES}/get-messages`;
export const UPLOADS_FILES_ROUTES=`${MESSAGES_ROUTES}/uploads-file`

export const CHANNEL_ROUTES='http://localhost:8747/api/channel/'
export const CREATE_CHANNELS_ROUTES=`${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS_ROUTES=`${CHANNEL_ROUTES}/get-user-channels`
export const GET_CHANNEL_MESSAGES=`${CHANNEL_ROUTES}/get-channel-messages`

//export const GET_ALL_MESSAGES_ROUTES = "http://localhost:8747/api/messages/get-messages";
//export const GET_ALL_MESSAGES_ROUTES = "http://localhost:5001/api/messages/get-messages";
