import axios from "axios";

export const getAvailableDates= async ()=>{
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL+'/v1/available-date');
    return data;
}

export const getAvailableDate= async (id)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-date/${id}`);
    return data;
}

export const deleteAvailableDate=async (id)=>{
    const {data} = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-date/${id}`);
    return data;
}
export const updateAvailableDate=async (availableDate,id)=>{
    const {data} = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-date/update/${id}`,availableDate);
    return data;
}
export const createAvailableDate=async (availableDate)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/available-date/save`,availableDate);
    return data;
}

