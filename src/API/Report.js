import axios from "axios";

export const getReports= async ()=>{
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL+'/v1/report');
    return data;
}

export const getReport= async (id)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/report/${id}`);
    return data;
}

export const deleteReport=async (id)=>{
    const {data} = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/report/${id}`);
    return data;
}
export const updateReport=async (report,id)=>{
    const {data} = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/report/update/${id}`,report);
    return data;
}
export const createReport=async (report)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/report/save`,report);
    return data;
}

export const getUnreportedAppointments=async()=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/report/unreported`);
  return data
}

