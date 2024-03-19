import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  deleteReport,
  getReports,
  updateReport,
  createReport,
  getReport,
  getUnreportedAppointments,
} from "../../API/Report";
import { useState, useEffect } from "react";
import { splitDateTime, formatDate } from "../../Utils/FormatDate";

function Report() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [id, setId] = useState("");
  const [unreportedAppointments, setUnreportedAppointments] = useState([]);
  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const reportWithId = await getReport(id);

      setByIdReport({
        title: reportWithId.title,
        diagnosis: reportWithId.diagnosis,
        price: reportWithId.price,
        animalId: reportWithId.animalId,
      });
    } catch (error) {
      showMessage(error.response.data.message);
      setByIdReport({
        title: "",
        diagnosis: "",
        price: "",
        animalId: "",
      });
    }
  };
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    diagnosis: "",
    price: "",
  });

  const [newReportFormData, setNewReportFormData] = useState({
    title: "",
    diagnosis: "",
    price: "",
    appointmentId: "",
  });
  const [ByIdReport, setByIdReport] = useState({
    title: "",
    diagnosis: "",
    price: "",
    animalId: "",
  });
  const [message, setMessage] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };
  const handleNewReportChange = (event) => {
    const { name, value } = event.target;
    setNewReportFormData((prevFormData) => ({
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
        const data = await getReports();
        setReports(data);
        const appointmentData = await getUnreportedAppointments();
        setUnreportedAppointments(appointmentData);
      } catch (error) {
        showMessage(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      setReports(reports.filter((report) => report.id !== id));
      showMessage(`${id}'li rapor silindi .`);
    } catch (error) {
      showMessage(` ${id}'li rapor silinemedi:`, error);
    }
  };

  const handleUpdate = async (id, updatedReport) => {
    try {
      const updatedData = await updateReport(updatedReport, id);
      setReports(
        reports.map((report) => {
          if (report.id === id) {
            return { ...report, ...updatedData };
          }
          return report;
        })
      );

      setSelectedReport(null);
      setUpdateFormData({
        title: "",
        diagnosis: "",
        price: "",
      });
    } catch (error) {
      showMessage(` ${id}'li rapor güncellenemedi:`, error);
    }
  };

  const handleUpdateClick = (report) => {
    setSelectedReport(report);
    setUpdateFormData({
      title: report.title,
      diagnosis: report.diagnosis,
      price: report.price,
    });
  };

  const handleNewReportSubmit = async (event) => {
    event.preventDefault();
    try {
      const newReportData = {
        title: newReportFormData.title,
        diagnosis: newReportFormData.diagnosis,
        price: newReportFormData.price,
        appointmentId: newReportFormData.appointmentId,
      };

      const newReport = await createReport(newReportData);
      setReports([...reports, newReport]);

      setNewReportFormData({
        title: "",
        diagnosis: "",
        price: "",
        appointmentId: "",
      });

      const appointmentData = await getUnreportedAppointments();
      setUnreportedAppointments(appointmentData);
    } catch (error) {
      showMessage("Rapor eklenemedi:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(selectedReport.id, updateFormData);
  };

  return (
    <>
      <section>
        <br />
        <h1>Rapor Paneli</h1>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Başlık</TableCell>
                <TableCell>Tanı</TableCell>
                <TableCell>Fiyat</TableCell>
                <TableCell>Hayvan ID</TableCell>
                <TableCell>Sil</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.diagnosis}</TableCell>
                  <TableCell>{report.price}</TableCell>
                  <TableCell>{report.animalId}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(report.id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(report)}
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
            <h2>Yeni Rapor Kayıt</h2>
            <form onSubmit={handleNewReportSubmit}>
              <h6>Başlık</h6>
              <input
                type="text"
                name="title"
                onChange={handleNewReportChange}
                value={newReportFormData.title}
              />
              <h6>Tanı</h6>
              <input
                type="text"
                name="diagnosis"
                onChange={handleNewReportChange}
                value={newReportFormData.diagnosis}
              />
              <h6>Fiyat</h6>
              <input
                type="number"
                step="0.01"
                name="price"
                onChange={handleNewReportChange}
                value={newReportFormData.price}
              />
              <h6>
                Randevu Seçiniz
                <span className="warning">
                  (Rapor oluşturulmamışlar listelendi){" "}
                </span>{" "}
              </h6>
              <select name="appointmentId" onChange={handleNewReportChange}>
                <option disabled selected>
                  Randevu Seçiniz
                </option>
                {unreportedAppointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    id:{appointment.id}{" "}
                    {formatDate(
                      splitDateTime(appointment.appointmentDate).date
                    )}
                    {" Saat:"}
                    {splitDateTime(appointment.appointmentDate).time}{" "}
                    {appointment.animal.name}
                  </option>
                ))}
              </select>

              <Button variant="contained" color="success" type="submit">
                Kaydet
              </Button>
            </form>
          </div>

          {selectedReport && (
            <div className="form-container">
              <h2>Rapor Güncelle</h2>
              <form onSubmit={handleSubmit}>
                <h6>Başlık</h6>
                <input
                  type="text"
                  name="title"
                  value={updateFormData.title}
                  onChange={handleUpdateChange}
                />

                <h6>Tanı</h6>
                <input
                  type="text"
                  name="diagnosis"
                  value={updateFormData.diagnosis}
                  onChange={handleUpdateChange}
                />
                <h6>Fiyat</h6>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={updateFormData.price}
                  onChange={handleUpdateChange}
                />

                <Button variant="contained" type="submit">
                  Güncelle
                </Button>
                <br />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setSelectedReport(null)}
                >
                  İptal
                </Button>
              </form>
            </div>
          )}

          <div className="form-container">
            <h2>ID ile Rapor Ara</h2>
            <form onSubmit={handleGetById}>
              <input type="number" name="id" onChange={handleGetByIdChange} />
              <Button variant="contained" type="submit">
                Arama
              </Button>

              <h6>Başlık</h6>
              <input
                type="text"
                name="title"
                value={ByIdReport.title}
                disabled
              />
              <h6>Tanı</h6>
              <input
                type="text"
                name="diagnosis"
                value={ByIdReport.diagnosis}
                disabled
              />
              <h6>Price</h6>
              <input
                type="text"
                name="price"
                value={ByIdReport.price}
                disabled
              />
              <h6>Hayvan ID</h6>
              <input
                type="text"
                name="animalId"
                value={ByIdReport.animalId}
                disabled
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Report;
