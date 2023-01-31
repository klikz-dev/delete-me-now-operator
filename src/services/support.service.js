import axios from "axios";

export const supportGetAllUsersService = async () => {
  try {
    return await axios.get(`${window.$server_url}/support/user/all`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetUsersByAssigneeService = async (assigneeId) => {
  try {
    return await axios.get(
      `${window.$server_url}/support/user/list/${assigneeId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetUserByIdService = async (id) => {
  try {
    return await axios.get(`${window.$server_url}/support/user/${id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetUserIdByEmailService = async (email, name) => {
  try {
    return await axios.post(`${window.$server_url}/support/user/getid`, {
      email: email,
      role: "agent",
      name: name,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetAllTicketsService = async () => {
  try {
    return await axios.get(`${window.$server_url}/support/ticket/all`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetTicketsByIdService = async (id) => {
  try {
    return await axios.get(`${window.$server_url}/support/ticket/list/${id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetTicketService = async (id) => {
  try {
    return await axios.get(`${window.$server_url}/support/ticket/${id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportCreateTicketService = async (ticket) => {
  try {
    return await axios.post(`${window.$server_url}/support/ticket/create`, {
      ticket: ticket,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportUpdateTicketService = async (id, ticket) => {
  try {
    return await axios.post(`${window.$server_url}/support/ticket/update`, {
      id: id,
      ticket: ticket,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const supportGetCommentsService = async (id) => {
  try {
    return await axios.get(
      `${window.$server_url}/support/ticket/comments/${id}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
