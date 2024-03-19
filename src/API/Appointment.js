import axios from "axios";

export const getAppointments= async ()=>{
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL+'/v1/appointment');
    return data;
}

export const getAppointment= async (id)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/${id}`);
    return data;
}

export const deleteAppointment=async (id)=>{
    const {data} = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/${id}`);
    return data;
}
export const updateAppointment=async (appointment,id)=>{
    const {data} = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/update/${id}`,appointment);
    return data;
}
export const createAppointment=async (appointment)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/save`,appointment);
    return data;
}

export const filteredByDoctor=async(body)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/filteredByDoctor`,body);
    return data;
}

export const filteredByAnimal=async(body)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/filteredByAnimal`,body);
    return data;
}