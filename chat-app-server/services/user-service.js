const {
    addUser:accessAddUser,
    getUserByName:accessGetUserByName,
    getUserById:accessgetUserById
  } = require("../data-access/user-access");


  // Get a user by ID
  const getUserById = async (id) => {
    return await accessgetUserById(id);
  };
  
  // Get a user by ID
  const getUserByName = async (username) => {
    return await accessGetUserByName(username);
  };
  
  // Add a new user
  const addUser = async (username, email, password) => {
    return await accessAddUser(username, email, password);
  };

  module.exports = { getUserById,getUserByName,addUser };

