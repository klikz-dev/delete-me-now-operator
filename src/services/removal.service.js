import axios from "axios";

export const removalGetAllReportsService = async () => {
  try {
    return await axios.get(`${window.$server_url}/removal/reports/all`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const removalGetReportListService = async () => {
  try {
    return await axios.get(`${window.$server_url}/removal/reports`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const removalGetReportService = async (id) => {
  try {
    return await axios.get(`${window.$server_url}/removal/reports/${id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const removalGetProcessListService = async (id) => {
  try {
    return await axios.get(`${window.$server_url}/removal/processes/${id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const removalUpdateProcesService = async (id, process) => {
  try {
    return await axios.post(`${window.$server_url}/removal/processes/update`, {
      id: id,
      process: process,
    });
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
