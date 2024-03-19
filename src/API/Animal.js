import axios from "axios";

export const getAnimals= async ()=>{
    const {data} = await axios.get(
        import.meta.env.VITE_APP_BASE_URL+'/v1/animal');
    return data;
}

export const getAnimal= async (id)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/${id}`);
    return data;
}

export const deleteAnimal=async (id)=>{
    const {data} = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/${id}`);
    return data;
}
export const updateAnimal=async (animal,id)=>{
    const {data} = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/update/${id}`,animal);
    return data;
}
export const createAnimal=async (animal)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/save`,animal);
    return data;
}

export const getByOwnerName= async (name)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/byOwnerName?ownerName=${name}`);
    return data;
}

export const getByAnimalName= async (name)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/byName?name=${name}`);
    return data;
}

export const getCustomerAnimals= async (customerId)=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/v1/animal/customer?customerId=${customerId}`);
    return data;
}