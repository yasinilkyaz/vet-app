import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  deleteAppointment,
  getAppointments,
  updateAppointment,
  createAppointment,
  getAppointment,
  filteredByDoctor,
  filteredByAnimal,
} from "../../API/Appointment";
import { getAnimals } from "../../API/Animal";
import { getDoctors } from "../../API/Doctor";
import { useState, useEffect } from "react";
import { splitDateTime, formatDate } from "../../Utils/FormatDate";

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [id, setId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [animals, setAnimals] = useState([]);
  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const appointmentWithId = await getAppointment(id);

      setByIdAppointment({
        appointmentDate: appointmentWithId.appointmentDate,
        doctor: {
          id: appointmentWithId.doctor.id,
          name: appointmentWithId.doctor.name,
        },
        animal: {
          id: appointmentWithId.animal.id,
          name: appointmentWithId.animal.name,
          customer: {
            name: appointmentWithId.animal.customer.name,
          },
        },
      });
    } catch (error) {
      showMessage(error.response.data.message);
      setByIdAppointment({
        appointmentDate: "",
        doctor: {
          id: "",
          name: "",
        },
        animal: {
          id: "",
          name: "",
          customer: {
            name: "",
          },
        },
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
    appointmentDate: "",
    appointmentHour: "",
    doctorId: "",
    animalId: "",
  });

  const [newAppointmentFormData, setNewAppointmentFormData] = useState({
    appointmentDate: "",
    appointmentHour: "",
    doctorId: "",
    animalId: "",
  });
  const [ByIdAppointment, setByIdAppointment] = useState({
    appointmentDate: "",
    doctor: {
      id: "",
      name: "",
    },
    animal: {
      id: "",
      name: "",
      customer: {
        name: "",
      },
    },
  });

  const handleNewAppointmentChange = (event) => {
    const { name, value } = event.target;

    setNewAppointmentFormData((prevFormData) => ({
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
        const data = await getAppointments();
        setAppointments(data);
        const dataDoc = await getDoctors();
        setDoctors(dataDoc);
        const dataAni = await getAnimals();
        setAnimals(dataAni);
      } catch (error) {
        showMessage(error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id)
      );
      showMessage(`${id}'li randevu silindi.`);
    } catch (error) {
      showMessage(`${id}'li rapor silinemedi:`, error);
    }
  };

  const handleUpdate = async (id, updatedAppointment) => {
    try {
      const updatedData = await updateAppointment(updatedAppointment, id);
      setAppointments(
        appointments.map((appointment) => {
          if (appointment.id === id) {
            return { ...appointment, ...updatedData };
          }
          return appointment;
        })
      );

      setSelectedAppointment(null);
      setUpdateFormData({
        appointmentDate: "",
        doctor: {
          id: "",
          name: "",
        },
        animal: {
          id: "",
          name: "",
          customer: {
            name: "",
          },
        },
      });
    } catch (error) {
      showMessage(`${id}'li randevu güncellenemedi:`, error);
    }
  };

  const handleUpdateClick = (appointment) => {
    setSelectedAppointment(appointment);
    const { date, time } = splitDateTime(appointment.appointmentDate);

    setUpdateFormData({
      appointmentDate: date,
      appointmentHour: time,
      doctorId: appointment.doctor.id,
      animalId: appointment.animal.id,
    });
  };

  const handleNewAppointmentSubmit = async (event) => {
    event.preventDefault();
    try {
      const newAppointmentData = {
        appointmentDate: newAppointmentFormData.appointmentDate,
        appointmentHour: newAppointmentFormData.appointmentHour,
        doctorId: newAppointmentFormData.doctorId,
        animalId: newAppointmentFormData.animalId,
      };

      const newAppointment = await createAppointment(newAppointmentData);
      setAppointments([...appointments, newAppointment]);

      setNewAppointmentFormData({
        appointmentDate: "",
        appointmentHour: "",
        doctorId: "",
        animalId: "",
      });
    } catch (error) {
      showMessage("Randevu eklenemedi:", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(selectedAppointment.id, updateFormData);
  };
  //doktora göre filtre
  const [filterDoctorFormData, setFilterDoctorFormData] = useState({
    startDate: "",
    endDate: "",
    id: "",
  });

  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleDoctorFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterDoctorFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFilterByDoctor = async (event) => {
    event.preventDefault();
    try {
      const data = await filteredByDoctor(filterDoctorFormData);

      setFilteredAppointments(data.appointments);
    } catch (error) {
      showMessage("Doktora göre randevuları filtreleme hatası:", error);
      setFilteredAppointments([]);
    }
  };
  //doktora göre filtre

  const [filterAnimalFormData, setFilterAnimalFormData] = useState({
    startDate: "",
    endDate: "",
    id: "",
  });

  const handleAnimalFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterAnimalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleFilterByAnimal = async (event) => {
    event.preventDefault();
    try {
      const data = await filteredByAnimal(filterAnimalFormData);

      setFilteredAppointments(data.appointments);
    } catch (error) {
      showMessage("Hayvana göre randevuları filtreleme hatası:", error);
      setFilteredAppointments([]);
    }
  };
  return (
    <>
      <section>
        <br />
        <h1>Randevu Paneli</h1>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tarih ve Saat</TableCell>
                <TableCell>Doktor</TableCell>
                <TableCell>Hayvan</TableCell>
                <TableCell>Müşteri</TableCell>
                <TableCell>Sil</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>
                    {formatDate(
                      splitDateTime(appointment.appointmentDate).date
                    )}
                    {" Saat:"}
                    {splitDateTime(appointment.appointmentDate).time}
                  </TableCell>
                  <TableCell>{appointment.doctor.name}</TableCell>
                  <TableCell>{appointment.animal.name}</TableCell>
                  <TableCell>{appointment.animal.customer.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(appointment)}
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
            <h2>Yeni Randevu Kayıt</h2>
            <form onSubmit={handleNewAppointmentSubmit}>
              <h6>Tarih</h6>
              <input
                type="date"
                name="appointmentDate"
                onChange={handleNewAppointmentChange}
                value={newAppointmentFormData.appointmentDate}
              />
              <h6>
                Saat{" "}
                <span className="warning">
                  {" "}
                  aralığı 9-17 arasında olmalıdır
                </span>
              </h6>
              <input
                type="number"
                name="appointmentHour"
                onChange={handleNewAppointmentChange}
                value={newAppointmentFormData.appointmentHour}
              />
              <h6>Doktor Seçiniz</h6>
              <select name="doctorId" onChange={handleNewAppointmentChange}>
                <option disabled selected>
                  Doktor Seçiniz
                </option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    ID:{doctor.id} {doctor.name}
                  </option>
                ))}
              </select>
              <h6>Hayvan Seçiniz</h6>
              <select name="animalId" onChange={handleNewAppointmentChange}>
                <option disabled selected>
                  Hayvan Seçiniz
                </option>
                {animals?.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    ID:{animal.id} {animal.name}
                  </option>
                ))}
              </select>

              <Button variant="contained" color="success" type="submit">
                Kaydet
              </Button>
            </form>
          </div>

          {selectedAppointment && (
            <div className="form-container">
              <h2>Randevu Güncelle</h2>
              <form onSubmit={handleSubmit}>
                <h6>Tarih</h6>
                <input
                  type="date"
                  name="appointmentDate"
                  value={updateFormData.appointmentDate}
                  onChange={handleUpdateChange}
                />
                <h6>
                  Saat{" "}
                  <span className="warning">
                    {" "}
                    aralığı 9-17 arasında olmalıdır
                  </span>
                </h6>
                <input
                  type="number"
                  name="appointmentHour"
                  onChange={handleUpdateChange}
                  value={updateFormData.appointmentHour}
                />
                <select
                  name="doctorId"
                  onChange={handleUpdateChange}
                  value={updateFormData.doctorId}
                >
                  <option disabled selected>
                    Doktor Seçiniz
                  </option>
                  {doctors?.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      ID:{doctor.id} {doctor.name}
                    </option>
                  ))}
                </select>
                <select
                  name="animalId"
                  onChange={handleUpdateChange}
                  value={updateFormData.animalId}
                >
                  <option disabled selected>
                    Hayvan Seçiniz
                  </option>
                  {animals?.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      ID:{animal.id} {animal.name}
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
                  onClick={() => setSelectedAppointment(null)}
                >
                  İptal
                </Button>
              </form>
            </div>
          )}

          <div className="form-container">
            <h2>ID ile Randevu Ara</h2>
            <form onSubmit={handleGetById}>
              <input type="number" name="id" onChange={handleGetByIdChange} />
              <Button variant="contained" type="submit">
                Arama
              </Button>
              <h6>Tarih</h6>
              <input
                type="text"
                name="appointmentDate"
                value={
                  ByIdAppointment.appointmentDate
                    ? `${formatDate(
                        splitDateTime(ByIdAppointment.appointmentDate).date
                      )} Saat: ${
                        splitDateTime(ByIdAppointment.appointmentDate).time
                      }`
                    : ""
                }
                disabled
              />
              <h6>Doktor</h6>
              <input
                type="text"
                name="doctorId"
                value={`${ByIdAppointment.doctor.id} ${ByIdAppointment.doctor.name}`}
                disabled
              />
              <h6>Hayvan</h6>
              <input
                type="text"
                name="animalId"
                value={`${ByIdAppointment.animal.id} ${ByIdAppointment.animal.name}`}
                disabled
              />
            </form>
          </div>
        </div>
        <div className="second-block">
          <div className="form-container">
            <h2>Doktora Göre Randevuları Filtrele</h2>
            <form onSubmit={handleFilterByDoctor}>
              <input
                type="date"
                name="startDate"
                value={filterDoctorFormData.startDate}
                onChange={handleDoctorFilterChange}
              />
              <input
                type="date"
                name="endDate"
                value={filterDoctorFormData.endDate}
                onChange={handleDoctorFilterChange}
              />
              <h6>Doktor Seçiniz</h6>
              <select
                name="id"
                value={filterDoctorFormData.doctorId}
                onChange={handleDoctorFilterChange}
              >
                <option disabled selected>
                  Doktor Seçiniz
                </option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    ID:{doctor.id} {doctor.name}
                  </option>
                ))}
              </select>
              <Button variant="contained" color="success" type="submit">
                Filtrele
              </Button>
            </form>
          </div>
          <div className="form-container">
            <h2>Hayvana Göre Randevuları Filtrele</h2>
            <form onSubmit={handleFilterByAnimal}>
              <input
                type="date"
                name="startDate"
                value={filterAnimalFormData.startDate}
                onChange={handleAnimalFilterChange}
              />
              <input
                type="date"
                name="endDate"
                value={filterAnimalFormData.endDate}
                onChange={handleAnimalFilterChange}
              />
              <h6>Hayvan Seçiniz</h6>
              <select
                name="id"
                value={filterAnimalFormData.doctorId}
                onChange={handleAnimalFilterChange}
              >
                <option disabled selected>
                  Hayvan Seçiniz
                </option>
                {animals?.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    ID:{animal.id} {animal.name}
                  </option>
                ))}
              </select>
              <Button variant="contained" color="success" type="submit">
                Filtrele
              </Button>
            </form>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tarih ve Saat</TableCell>
                <TableCell>Doktor</TableCell>
                <TableCell>Hayvan</TableCell>
                <TableCell>Müşteri</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments?.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>
                    {formatDate(
                      splitDateTime(appointment.appointmentDate).date
                    )}
                    {" Saat:"}
                    {splitDateTime(appointment.appointmentDate).time}
                  </TableCell>
                  <TableCell>{appointment.doctor.name}</TableCell>
                  <TableCell>{appointment.animal.name}</TableCell>
                  <TableCell>{appointment.animal.customer.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </>
  );
}

export default Appointment;
