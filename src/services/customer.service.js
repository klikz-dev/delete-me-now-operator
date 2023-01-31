import axios from "axios";

export const customerGetTotalService = async (keyword) => {
  try {
    return await axios.get(`${window.$server_url}/customer/total`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetListService = async (page) => {
  try {
    return await axios.get(`${window.$server_url}/customer/list/${page}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetAllService = async () => {
  try {
    return await axios.get(`${window.$server_url}/customer/all`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetDataSheetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/customer/getdata/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetMembersService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/customer/members/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/customer/get/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerUpdateStatusService = async (id, status) => {
  try {
    return await axios.patch(`${window.$server_url}/customer/updatestatus`, {
      id: id,
      status: status,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerUpdateAssigneesService = async (id, assignee) => {
  try {
    return await axios.patch(`${window.$server_url}/customer/updateassignee`, {
      id: id,
      assignee: assignee,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerDeleteService = async (_id) => {
  try {
    return await axios.delete(`${window.$server_url}/customer/delete/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerUpdateService = async (customer) => {
  try {
    return await axios.patch(`${window.$server_url}/customer/update`, customer);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetInvoicesService = async (customerId) => {
  try {
    return await axios.get(
      `${window.$server_url}/customer/invoices/${customerId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetCardsService = async (customerId) => {
  try {
    return await axios.get(
      `${window.$server_url}/customer/cards/${customerId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetAlertsService = async (customerId) => {
  try {
    return await axios.get(`${window.$server_url}/alerts/${customerId}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerSolveAlertService = async (customerId, alertId) => {
  try {
    return await axios.post(`${window.$server_url}/alerts/solve`, {
      customerId: customerId,
      alertId: alertId,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetReportIDService = async (customerId) => {
  try {
    return await axios.get(
      `${window.$server_url}/customer/reportid/${customerId}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
