import axios from "axios";

export const getCustomers= async ()=>{
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL+'/v1/customer');
    return data;
}

export const getCustomer= async (id)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/customer/${id}`);
    return data;
}

export const deleteCustomer=async (id)=>{
    const {data} = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/customer/${id}`);
    return data;
}
export const updateCustomer=async (customer,id)=>{
    const {data} = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/customer/update/${id}`,customer);
    return data;
}
export const createCustomer=async (customer)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/customer/save`,customer);
    return data;
}

