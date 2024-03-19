import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { formatDate } from "../../Utils/FormatDate";
import {
  deleteAnimal,
  getAnimals,
  updateAnimal,
  createAnimal,
  getAnimal,
  getCustomerAnimals,
  getByAnimalName,
  getByOwnerName,
} from "../../API/Animal";
import { getCustomers } from "../../API/Customer";
import { useState, useEffect } from "react";

function Animal() {
  const [animals, setAnimals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [id, setId] = useState("");
  const [resultAnimal, setResultAnimal] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [animalName, setAnimalName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const animalWithId = await getAnimal(id);

      setByIdAnimal({
        name: animalWithId.name,
        species: animalWithId.species,
        breed: animalWithId.breed,
        gender: animalWithId.gender,
        colour: animalWithId.colour,
        dateOfBirth: animalWithId.dateOfBirth,
      });
    } catch (error) {
      showMessage(error.response.data.message);
      setByIdAnimal({
        name: "",
        species: "",
        breed: "",
        gender: "",
        colour: "",
        dateOfBirth: "",
      });
    }
  };

  const [message, setMessage] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    colour: "",
    dateOfBirth: "",
    customerId: "",
  });

  const [newAnimalFormData, setNewAnimalFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    colour: "",
    dateOfBirth: "",
    customerId: "",
  });
  const [ByIdAnimal, setByIdAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    colour: "",
    dateOfBirth: "",
  });

  const handleNewAnimalChange = (event) => {
    const { name, value } = event.target;
    setNewAnimalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;
    setUpdateFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnimals();
        setAnimals(data);
      } catch (error) {
        showMessage(error);
      }
    };

    fetchData();

    const fetchCustomerData = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        showMessage(error);
      }
    };
    fetchCustomerData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAnimal(id);
      setAnimals(animals.filter((animal) => animal.id !== id));
      showMessage(`${id}'li hayvan silindi.`);
    } catch (error) {
      showMessage(`${id}'li hayvan silinemedi:`, error);
    }
  };

  const handleUpdate = async (id, updatedAnimal) => {
    try {
      const updatedData = await updateAnimal(updatedAnimal, id);
      setAnimals(
        animals.map((animal) => {
          if (animal.id === id) {
            return { ...animal, ...updatedData };
          }
          return animal;
        })
      );

      setSelectedAnimal(null);
      setUpdateFormData({
        name: "",
        species: "",
        breed: "",
        gender: "",
        colour: "",
        dateOfBirth: "",
        customerId: "",
      });
    } catch (error) {
      showMessage(`${id}'li hayvan güncellenemedi:`, error);
    }
  };

  const handleUpdateClick = (animal) => {
    setSelectedAnimal(animal);
    setUpdateFormData({
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      gender: animal.gender,
      colour: animal.colour,
      dateOfBirth: animal.dateOfBirth,
      customerId: animal.customerId,
    });
  };

  const handleNewAnimalSubmit = async (event) => {
    event.preventDefault();
    try {
      const newAnimalData = {
        name: newAnimalFormData.name,
        species: newAnimalFormData.species,
        breed: newAnimalFormData.breed,
        gender: newAnimalFormData.gender,
        colour: newAnimalFormData.colour,
        dateOfBirth: newAnimalFormData.dateOfBirth,
        customerId: newAnimalFormData.customerId,
      };

      const newAnimal = await createAnimal(newAnimalData);
      setAnimals([...animals, newAnimal]);

      setNewAnimalFormData({
        name: "",
        species: "",
        breed: "",
        gender: "",
        colour: "",
        dateOfBirth: "",
      });
    } catch (error) {
      showMessage("Hayvan eklenemedi:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(selectedAnimal.id, updateFormData);
  };

  //Müşterinin hayvanını getir

  const handleCustomerId = (event) => {
    const { value } = event.target;

    setSelectedCustomerId(value);
  };

  const handleGetAnimalsForCustomer = async (event) => {
    event.preventDefault();
    try {
      const customerAnimals = await getCustomerAnimals(selectedCustomerId);
      setResultAnimal(customerAnimals);
    } catch (error) {
      const errorSample = "Required parameter 'customerId' is not present.";
      if (error.response.data.message === errorSample) {
        setResultAnimal([]);
      }
    }
  };
  //Müşterinin hayvanını getir

  //Hayvanın ismine göre getir
  const handleGetAnimalName = async (event) => {
    event.preventDefault();
    try {
      const data = await getByAnimalName(animalName);

      setResultAnimal(data);
    } catch (error) {
      const errorSample = "Required parameter 'name' is not present.";
      if (error.response.data.message === errorSample) {
        setResultAnimal([]);
      }
    }
  };
  const handleAnimalName = (event) => {
    const { value } = event.target;
    setAnimalName(value);
  };

  //Hayvanın ismine göre getir

  //Sahip ismine göre getir

  const handleOwnerName = (event) => {
    const { value } = event.target;
    setOwnerName(value);
  };

  const handleGetByOwnerName = async (event) => {
    event.preventDefault();
    try {
      const animalsByOwner = await getByOwnerName(ownerName);
      setResultAnimal(animalsByOwner);
    } catch (error) {
      showMessage("Sahibe göre filtreleme hatası:", error);
      setResultAnimal([]);
    }
  };
  //Sahip ismine göre getir
  return (
    <>
      <section>
        <br />
        <h1>Hayvan Paneli</h1>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Hayvan İsmi</TableCell>
                <TableCell>Tür</TableCell>
                <TableCell>Cins</TableCell>
                <TableCell>Cinsiyet</TableCell>
                <TableCell>Renk</TableCell>
                <TableCell>Doğum Tarihi</TableCell>
                <TableCell>Sil</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.id}</TableCell>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>{animal.colour}</TableCell>
                  <TableCell>{formatDate(animal.dateOfBirth)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(animal.id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(animal)}
                    >
                      Güncelle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {message && <message>{message}</message>}
        <div className="container">
          <div className="form-container">
            <h2>Yeni Hayvan Kayıt</h2>
            <form onSubmit={handleNewAnimalSubmit}>
              <h6>İsim</h6>
              <input
                type="text"
                name="name"
                onChange={handleNewAnimalChange}
                value={newAnimalFormData.name}
              />
              <h6>Tür</h6>
              <input
                type="text"
                name="species"
                onChange={handleNewAnimalChange}
                value={newAnimalFormData.species}
              />
              <h6>Cins</h6>
              <input
                type="text"
                name="breed"
                onChange={handleNewAnimalChange}
                value={newAnimalFormData.breed}
              />
              <h6>Cinsiyet</h6>

              <select name="gender" onChange={handleNewAnimalChange}>
                <option value="" selected disabled>
                  Seçiniz
                </option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              <h6>Renk</h6>
              <input
                type="text"
                name="colour"
                onChange={handleNewAnimalChange}
                value={newAnimalFormData.colour}
              />
              <h6>Doğum Tarihi</h6>
              <input
                type="date"
                name="dateOfBirth"
                onChange={handleNewAnimalChange}
                value={newAnimalFormData.dateOfBirth}
              />
              <h6>Müşteri Seç</h6>
              <select name="customerId" onChange={handleNewAnimalChange}>
                <option disabled selected>
                  Müşteri Seçiniz
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    ID:{customer.id} {customer.name}
                  </option>
                ))}
              </select>
              <Button variant="contained" color="success" type="submit">
                Kaydet
              </Button>
            </form>
          </div>

          {selectedAnimal && (
            <div className="form-container">
              <h2>Hayvan Güncelle</h2>

              <form onSubmit={handleSubmit}>
                <h6>İsim</h6>
                <input
                  type="text"
                  name="name"
                  value={updateFormData.name}
                  onChange={handleUpdateChange}
                />
                <h6>Tür</h6>
                <input
                  type="text"
                  name="species"
                  value={updateFormData.species}
                  onChange={handleUpdateChange}
                />
                <h6>Cins</h6>
                <input
                  type="text"
                  name="breed"
                  value={updateFormData.breed}
                  onChange={handleUpdateChange}
                />
                <h6>Cinsiyet</h6>
                <select
                  name="gender"
                  value={updateFormData.gender}
                  onChange={handleUpdateChange}
                >
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
                <h6>Renk</h6>
                <input
                  type="text"
                  name="colour"
                  value={updateFormData.colour}
                  onChange={handleUpdateChange}
                />
                <h6>Doğum Tarihi</h6>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={updateFormData.dateOfBirth}
                  onChange={handleUpdateChange}
                />
                <h6>Müşteri Seç</h6>
                <select
                  name="customerId"
                  value={updateFormData.customerId}
                  onChange={handleUpdateChange}
                >
                  <option disabled selected>
                    Müşteri Seçiniz
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      ID:{customer.id} {customer.name}
                    </option>
                  ))}
                </select>
                <Button variant="contained" type="submit">
                  Güncelle
                </Button>
                <br />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setSelectedAnimal(null)}
                >
                  İptal
                </Button>
              </form>
            </div>
          )}

          <div className="form-container">
            <h2>ID ile Hayvan Ara</h2>
            <form onSubmit={handleGetById}>
              <input type="number" name="id" onChange={handleGetByIdChange} />
              <Button variant="contained" type="submit">
                Arama
              </Button>
              <h6>İsim</h6>
              <input type="text" name="name" value={ByIdAnimal.name} disabled />
              <h6>Tür</h6>
              <input
                type="text"
                name="species"
                value={ByIdAnimal.species}
                disabled
              />
              <h6>Cins</h6>
              <input
                type="text"
                name="breed"
                value={ByIdAnimal.breed}
                disabled
              />
              <h6>Cinsiyet</h6>
              <input
                type="text"
                name="gender"
                value={ByIdAnimal.gender}
                disabled
              />
              <h6>Renk</h6>
              <input
                type="text"
                name="colour"
                value={ByIdAnimal.colour}
                disabled
              />
              <h6>Doğum Tarihi</h6>
              <input
                type="date"
                name="dateOfBirth"
                value={ByIdAnimal.dateOfBirth}
                disabled
              />
            </form>
          </div>
          <div className="second-block">
            <div className="form-container">
              <h2>Müşterinin Hayvanlarını Listele</h2>
              <form onSubmit={handleGetAnimalsForCustomer}>
                <h6>Müşteri Seç</h6>
                <select name="customerId" onChange={handleCustomerId}>
                  <option disabled selected>
                    Müşteri Seçiniz
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      ID:{customer.id} {customer.name}
                    </option>
                  ))}
                </select>
                <Button variant="contained" type="submit">
                  Getir
                </Button>
              </form>
            </div>

            <div className="form-container">
              <h2>Hayvanın Adına Göre Listele</h2>
              <form onSubmit={handleGetAnimalName}>
                <h6>
                  Hayvan Adı{" "}
                  <span className="warning">Büyük küçük harf duyarlıdır.</span>
                </h6>
                <input type="text" onChange={handleAnimalName} />
                <Button variant="contained" type="submit">
                  Getir
                </Button>
              </form>
            </div>

            <div className="form-container">
              <h2>Sahibinin Adına Göre Listele</h2>
              <form onSubmit={handleGetByOwnerName}>
                <h6>
                  Sahip Adı{" "}
                  <span className="warning">Büyük küçük harf duyarlıdır.</span>
                </h6>
                <input type="text" onChange={handleOwnerName} />
                <Button variant="contained" type="submit">
                  Getir
                </Button>
              </form>
            </div>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Hayvan İsmi</TableCell>
                <TableCell>Tür</TableCell>
                <TableCell>Cins</TableCell>
                <TableCell>Cinsiyet</TableCell>
                <TableCell>Renk</TableCell>
                <TableCell>Doğum Tarihi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultAnimal?.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.id}</TableCell>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>{animal.colour}</TableCell>
                  <TableCell>{formatDate(animal.dateOfBirth)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </>
  );
}

export default Animal;
