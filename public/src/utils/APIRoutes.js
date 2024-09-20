export const host = 'https://chat-sphere-backend-1.onrender.com/'
export const registerRoute = `${host}/api/auth/register`// after register the fronend will sends data to this link
export const loginRoute = `${host}/api/auth/login`
export const setAvatarRoute = `${host}/api/auth/setAvatar`// when the user after login or registration update there profile photo the front end will send all the details to this link 
export const allUsersRoute = `${host}/api/auth/allusers` // from here all the contacts will be fetched
export const sendMessageRoute = `${host}/api/messages/addmsg`// similarly when a request is comes to this the addmsg will start from messagesRoutes.js
export const getAllMessagesRoute = `${host}/api/messages/getMsg`
