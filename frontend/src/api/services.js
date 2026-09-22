import api from "./api";


export const signIn = (formData) => api.post('/account/login', formData);
export const registerAccount = (formData) =>
  api.post("/account/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getCashiersByBank = (bankId) => api.get(`/account/cashiers/${bankId}`);
export const getAllManagers = () => api.get('/account/managers');

export const createBank = (bankData) => api.post('/bank', bankData);
export const fetchAllBanks = () => api.get('/bank');
export const fetchBankById = (id) => api.get(`/bank/${id}`);
export const updateBank = (id, updatedData) => api.put(`/bank/${id}`, updatedData);
export const deleteBank = (id) => api.delete(`/bank/${id}`);
export const AdminDashboard = () => api.get(`/bank/system-stats`);

export const createCustomer = (customerData) =>
  api.post("/customer", customerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getAllCustomers = () => api.get('/customer/customers');

export const getBranchCustomers = (bankId) => api.get(`/customer/branch/${bankId}`);
export const getCustomerDetails = (id) => api.get(`/customer/${id}`);
export const updateCustomer = (id, updatedData) => api.put(`/customer/${id}`, updatedData);
export const deleteCustomer = (id) => api.delete(`/customer/${id}`);

export const createDocumentType = (docData) => api.post('/document', docData);
export const getDocumentsByBank = (bankId) => api.get(`/document/bank/${bankId}`);
export const updateDocumentType = (id, updatedData) => api.put(`/document/${id}`, updatedData);
export const deleteDocumentType = (id) => api.delete(`/document/${id}`);

export const createLog = (logFormData) => api.post('/log', logFormData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getLogsByBank = (bankId) => api.get(`/log/bank/${bankId}`);
export const getLogsByCashier = (cashierId) => api.get(`/log/cashier/${cashierId}`);


export const createVerification = (formData) => api.post("/verification/create", formData);

export const verifyOtp = (formData) => api.post("/verification/verify", formData);

// Authorization Services
export const createAuthorization = (authData) => api.post('/authorizations', authData);

export const getCustomerAuthorizations = (customerId) => api.get(`/authorizations/customer/${customerId}`);

// Add this to your Account section or near your other login services
export const customerLogin = (formData) => api.post('/customer/login', formData);
export const getCustomerDashboard = (customerId) => api.get(`/customer/dashboard/${customerId}`);

export const verifyAuthorization = (formData) =>
  api.post("/authorizations/verify", formData);