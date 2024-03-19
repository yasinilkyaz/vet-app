import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { formatDate } from "../Utils/FormatDate";
import {
  getAvailableDates,
  getAvailableDate,
  deleteAvailableDate,
  updateAvailableDate,
  createAvailableDate,
} from "../API/AvailableDate";
import { useState, useEffect } from "react";

function AvailableDate({ doctors }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedAvailableDate, setSelectedAvailableDate] = useState(null);
  const [id, setId] = useState("");
  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const availableDateWithId = await getAvailableDate(id);

      setByIdAvailableDate({
        availableDate: availableDateWithId.availableDate,
        doctorId: availableDateWithId.doctor.id,
      });
    } catch (error) {
      showMessage(error.response.data.message);
      setByIdAvailableDate({
        availableDate: "",
        doctorId: "",
      });
    }
  };
  const [updateFormData, setUpdateFormData] = useState({
    availableDate: "",
    doctorId: "",
  });

  const [newAvailableDateFormData, setNewAvailableDateFormData] = useState({
    availableDate: "",
    doctorId: "",
  });
  const [ByIdAvailableDate, setByIdAvailableDate] = useState({
    availableDate: "",
    doctorId: "",
  });

  const handleNewAvailableDateChange = (event) => {
    const { name, value } = event.target;
    setNewAvailableDateFormData((prevFormData) => ({
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
        const data = await getAvailableDates();
        setAvailableDates(data);
      } catch (error) {
        showMessage(error);
      }
    };

    fetchData();
  }, []);
  const [message, setMessage] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };
  const handleDelete = async (id) => {
    try {
      await deleteAvailableDate(id);
      setAvailableDates(
        availableDates.filter((availableDate) => availableDate.id !== id)
      );
      showMessage(`Müsait gün ID ${id} silindi`);
    } catch (error) {
      showMessage(`Müsait gün ID ${id}: silinemedi.`, error);
    }
  };

  const handleUpdate = async (id, updatedAvailableDate) => {
    try {
      const updatedData = await updateAvailableDate(updatedAvailableDate, id);
      setAvailableDates(
        availableDates.map((availableDate) => {
          if (availableDate.id === id) {
            return { ...availableDate, ...updatedData };
          }
          return availableDate;
        })
      );

      setSelectedAvailableDate(null);
      setUpdateFormData({
        availableDate: "",
        doctorId: "",
      });
    } catch (error) {
      showMessage(`${id}'li Müsait gün güncellenemedi:`, error);
    }
  };

  const handleUpdateClick = (availableDate) => {
    setSelectedAvailableDate(availableDate);
    setUpdateFormData({
      availableDate: availableDate.availableDate,
      doctorId: availableDate.doctor.id,
    });
  };

  const handleNewAvailableDateSubmit = async (event) => {
    event.preventDefault();
    try {
      const newAvailableDateData = {
        availableDate: newAvailableDateFormData.availableDate,
        doctorId: newAvailableDateFormData.doctorId,
      };

      const newAvailableDate = await createAvailableDate(newAvailableDateData);
      setAvailableDates([...availableDates, newAvailableDate]);

      setNewAvailableDateFormData({
        availableDate: "",
        doctorId: "",
      });
    } catch (error) {
      showMessage("Müsait gün oluşturulamadı:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(selectedAvailableDate.id, updateFormData);
  };

  return (
    <>
      <br />
      <h1>Müsait Gün Paneli</h1>
      <br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Müsait Gün</TableCell>
              <TableCell>Doktor ismi</TableCell>
              <TableCell>Doktor ID</TableCell>

              <TableCell>Sil</TableCell>
              <TableCell>Güncelle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availableDates.map((availableDate) => (
              <TableRow key={availableDate.id}>
                <TableCell>{availableDate.id}</TableCell>
                <TableCell>{formatDate(availableDate.availableDate)}</TableCell>
                <TableCell>{availableDate.doctor.name}</TableCell>
                <TableCell>{availableDate.doctor.id}</TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(availableDate.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateClick(availableDate)}
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
          <h2>Yeni Müsait Gün</h2>
          <form onSubmit={handleNewAvailableDateSubmit}>
            <h6>Tarih</h6>
            <input
              type="date"
              name="availableDate"
              onChange={handleNewAvailableDateChange}
              value={newAvailableDateFormData.availableDate}
            />
            <h6>Doktor ID</h6>

            <select name="doctorId" onChange={handleNewAvailableDateChange}>
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
              Yeni Müsait Gün Ekle
            </Button>
          </form>
        </div>

        {selectedAvailableDate && (
          <div className="form-container">
            <h2>Müsait Gün Güncelle</h2>
            <form onSubmit={handleSubmit}>
              <h6>Tarih</h6>
              <input
                type="date"
                name="availableDate"
                value={updateFormData.availableDate}
                onChange={handleUpdateChange}
              />
              <h6>Doktor ID</h6>
              <select
                name="doctorId"
                value={updateFormData.doctorId}
                onChange={handleUpdateChange}
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

              <Button variant="contained" type="submit">
                Güncelle
              </Button>
              <br />
              <Button
                variant="outlined"
                color="error"
                onClick={() => setSelectedAvailableDate(null)}
              >
                İptal
              </Button>
            </form>
          </div>
        )}

        <div className="form-container">
          <h2>Müsait Gün ID ile Arama</h2>
          <form onSubmit={handleGetById}>
            <input type="number" name="id" onChange={handleGetByIdChange} />
            <Button variant="contained" type="submit">
              Arama
            </Button>
          </form>
          <br />
          <h6>Tarih</h6>
          <input
            type="date"
            name="availableDate"
            value={ByIdAvailableDate.availableDate}
            disabled
          />
          <h6>Doktor ID</h6>
          <input
            type="number"
            name="doctorId"
            value={ByIdAvailableDate.doctorId}
            disabled
          />
        </div>
      </div>
    </>
  );
}

export default AvailableDate;
