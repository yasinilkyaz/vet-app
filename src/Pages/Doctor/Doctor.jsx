import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import {
  deleteDoctor,
  getDoctors,
  updateDoctor,
  createDoctor,
  getDoctor,
} from "../../API/Doctor";
import AvailableDate from "../../Components/AvailableDate";

function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [id, setId] = useState("");
  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const doctorWithId = await getDoctor(id);

      setByIdDoctor({
        name: doctorWithId.name,
        phone: doctorWithId.phone,
        email: doctorWithId.email,
        address: doctorWithId.address,
        city: doctorWithId.city,
      });
    } catch (error) {
      showMessage(error.response.data.message);
      setByIdDoctor({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    }
  };
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [newDoctorFormData, setNewDoctorFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [ByIdDoctor, setByIdDoctor] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [message, setMessage] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleNewDoctorChange = (event) => {
    const { name, value } = event.target;
    setNewDoctorFormData((prevFormData) => ({
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
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        showMessage(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
      showMessage(`${id}'li doktor silindi.`);
    } catch (error) {
      showMessage(`${id}'li doktor silinemedi:`, error);
    }
  };

  const handleUpdate = async (id, updatedDoctor) => {
    try {
      const updatedData = await updateDoctor(updatedDoctor, id);
      setDoctors(
        doctors.map((doctor) => {
          if (doctor.id === id) {
            return { ...doctor, ...updatedData };
          }
          return doctor;
        })
      );

      setSelectedDoctor(null);
      setUpdateFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
      showMessage(`${id}'li doktor güncellendi.`);
    } catch (error) {
      showMessage(`${id}'li doktor güncellenemedi:`, error);
    }
  };

  const handleUpdateClick = (doctor) => {
    setSelectedDoctor(doctor);
    setUpdateFormData({
      name: doctor.name,
      phone: doctor.phone,
      email: doctor.email,
      address: doctor.address,
      city: doctor.city,
    });
  };

  const handleNewDoctorSubmit = async (event) => {
    event.preventDefault();
    try {
      const newDoctorData = {
        name: newDoctorFormData.name,
        phone: newDoctorFormData.phone,
        email: newDoctorFormData.email,
        address: newDoctorFormData.address,
        city: newDoctorFormData.city,
      };

      const newDoctor = await createDoctor(newDoctorData);
      setDoctors([...doctors, newDoctor]);
      showMessage(`Yeni doktor Kaydedildi`);
      setNewDoctorFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      showMessage("Doktor kaydedilemedi:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(selectedDoctor.id, updateFormData);
  };

  return (
    <>
      <section>
        <br />
        <h1> Doktor Paneli</h1>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Doktor İsmi</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Adres</TableCell>
                <TableCell>Şehir</TableCell>
                <TableCell>Sil</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.id}</TableCell>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.address}</TableCell>
                  <TableCell>{doctor.city}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(doctor)}
                    >
                      Güncelle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {message && <message>{message}</message>}
          <div className="container">
            <div className="form-container">
              <h2>Yeni Doktor</h2>
              <form onSubmit={handleNewDoctorSubmit}>
                <h6>İsim</h6>
                <input
                  type="text"
                  name="name"
                  onChange={handleNewDoctorChange}
                  value={newDoctorFormData.name}
                />
                <h6>Telefon</h6>
                <input
                  type="text"
                  name="phone"
                  onChange={handleNewDoctorChange}
                  value={newDoctorFormData.phone}
                />
                <h6>Email</h6>
                <input
                  type="text"
                  name="email"
                  onChange={handleNewDoctorChange}
                  value={newDoctorFormData.email}
                />
                <h6>Adres</h6>
                <input
                  type="text"
                  name="address"
                  onChange={handleNewDoctorChange}
                  value={newDoctorFormData.address}
                />
                <h6>Şehir</h6>
                <input
                  type="text"
                  name="city"
                  onChange={handleNewDoctorChange}
                  value={newDoctorFormData.city}
                />
                <Button variant="contained" color="success" type="submit">
                  Add New doctor
                </Button>
              </form>
            </div>

            {selectedDoctor && (
              <div className="form-container">
                <h2>Doktor Güncelle</h2>
                <form onSubmit={handleSubmit}>
                  <h6>İsim</h6>
                  <input
                    type="text"
                    name="name"
                    value={updateFormData.name}
                    onChange={handleUpdateChange}
                  />
                  <h6>Telefon</h6>
                  <input
                    type="text"
                    name="phone"
                    value={updateFormData.phone}
                    onChange={handleUpdateChange}
                  />
                  <h6>Email</h6>
                  <input
                    type="text"
                    name="email"
                    value={updateFormData.email}
                    onChange={handleUpdateChange}
                  />
                  <h6>Adres</h6>
                  <input
                    type="text"
                    name="address"
                    value={updateFormData.address}
                    onChange={handleUpdateChange}
                  />
                  <h6>Şehir</h6>
                  <input
                    type="text"
                    name="city"
                    value={updateFormData.city}
                    onChange={handleUpdateChange}
                  />

                  <Button variant="contained" type="submit">
                    Update
                  </Button>
                  <br />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    İptal
                  </Button>
                </form>
              </div>
            )}

            <div className="form-container">
              <form onSubmit={handleGetById}>
                <input type="number" name="id" onChange={handleGetByIdChange} />
                <Button variant="contained" type="submit">
                  ID ile arama
                </Button>
                <br />
                <h6>İsim</h6>
                <input
                  type="text"
                  name="name"
                  value={ByIdDoctor.name}
                  disabled
                />
                <h6>Telefon</h6>
                <input
                  type="text"
                  name="phone"
                  value={ByIdDoctor.phone}
                  disabled
                />
                <h6>Email</h6>
                <input
                  type="text"
                  name="email"
                  value={ByIdDoctor.email}
                  disabled
                />
                <h6>Adres</h6>
                <input
                  type="text"
                  name="address"
                  value={ByIdDoctor.address}
                  disabled
                />
                <h6>Şehir</h6>
                <input
                  type="text"
                  name="city"
                  value={ByIdDoctor.city}
                  disabled
                />
              </form>
            </div>
          </div>
        </TableContainer>

        <AvailableDate doctors={doctors} />
      </section>
    </>
  );
}

export default Doctor;
