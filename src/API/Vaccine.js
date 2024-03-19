import axios from "axios";

export const getVaccines= async ()=>{
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL+'/v1/vaccine');
    return data;
}

export const getVaccine= async (id)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/${id}`);
    return data;
}

export const deleteVaccine=async (id)=>{
    const {data} = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/${id}`);
    return data;
}
export const updateVaccine=async (vaccine,id)=>{
    const {data} = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/update/${id}`,vaccine);
    return data;
}
export const createVaccine=async (vaccine)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/save`,vaccine);
    return data;
}

export const getVaccineByAnimal=async(animalId)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/byAnimal/${animalId}`);
    return data;
}

export const getVaccinesByProtectionDateRange=async(dates)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/vaccinesByProtectionDateRange`,dates);
    return data;
}