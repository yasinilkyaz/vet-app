import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  deleteVaccine,
  getVaccines,
  updateVaccine,
  createVaccine,
  getVaccine,
  getVaccineByAnimal,
  getVaccinesByProtectionDateRange,
} from "../../API/Vaccine";
import { getAnimals } from "../../API/Animal";
import { getReports, getReport } from "../../API/Report";
import { formatDate } from "../../Utils/FormatDate";

import { useState, useEffect } from "react";

function Vaccine() {
  const [vaccines, setVaccines] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [id, setId] = useState("");
  const [animals, setAnimals] = useState([]);
  const [reports, setReports] = useState([]);
  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const vaccineWithId = await getVaccine(id);

      setByIdVaccine({
        name: vaccineWithId.name,
        code: vaccineWithId.code,
        protectionStartDate: vaccineWithId.protectionStartDate,
        protectionFinishDate: vaccineWithId.protectionFinishDate,
        reportId: vaccineWithId.reportId,
        animalName: vaccineWithId.animal.name,
      });
    } catch (error) {
      showMessage(error.response.data.message);
      setByIdVaccine({
        name: "",
        code: "",
        protectionStartDate: "",
        protectionFinishDate: "",
        reportId: "",
        animalName: "",
      });
    }
  };
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animalId: "",
    reportId: "",
  });

  const [newVaccineFormData, setNewVaccineFormData] = useState({
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animalId: "",
    reportId: "",
  });
  const [ByIdVaccine, setByIdVaccine] = useState({
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animalId: "",
    reportId: "",
  });

  const handleNewVaccineChange = (event) => {
    const { name, value } = event.target;
    setNewVaccineFormData((prevFormData) => ({
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
        const data = await getVaccines();
        setVaccines(data);

        const animalsData = await getAnimals();
        setAnimals(animalsData);

        const reportsData = await getReports();
        setReports(reportsData);
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
      await deleteVaccine(id);
      setVaccines(vaccines.filter((vaccine) => vaccine.id !== id));
      showMessage(` ${id}'li aşı silindi'`);
    } catch (error) {
      showMessage(`${id}'li aşı silinemedi:`, error);
    }
  };

  const handleUpdate = async (id, updatedVaccine) => {
    try {
      const selectedAnimalId = parseInt(updatedVaccine.animalId);
      const selectedReportId = updatedVaccine.reportId;

      const selectedReport = await getReport(selectedReportId);
      const selectedReportAnimalId = selectedReport?.animalId;

      if (selectedAnimalId !== selectedReportAnimalId) {
        showMessage(
          "Güncellenen rapor, güncellenen hayvan ile eşleşmiyor. Lütfen doğru bir rapor seçiniz."
        );
        return;
      }

      const updatedData = await updateVaccine(updatedVaccine, id);
      setVaccines(
        vaccines.map((vaccine) => {
          if (vaccine.id === id) {
            return { ...vaccine, ...updatedData };
          }
          return vaccine;
        })
      );

      setSelectedVaccine(null);
      setUpdateFormData({
        name: "",
        code: "",
        protectionStartDate: "",
        protectionFinishDate: "",
        animalId: "",
        reportId: "",
      });
    } catch (error) {
      showMessage(` ${id}'li aşı güncellenemedi:`, error);
    }
  };

  const handleUpdateClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setUpdateFormData({
      name: vaccine.name,
      code: vaccine.code,
      protectionStartDate: vaccine.protectionStartDate,
      protectionFinishDate: vaccine.protectionFinishDate,
      animalId: vaccine.animal.id,
      reportId: vaccine.reportId,
    });
  };

  const handleNewVaccineSubmit = async (event) => {
    event.preventDefault();
    const selectedAnimalId = parseInt(newVaccineFormData.animalId);
    const selectedReportId = newVaccineFormData.reportId;

    const selectedReport = await getReport(selectedReportId);

    const selectedReportAnimalId = selectedReport?.animalId;

    if (selectedAnimalId !== selectedReportAnimalId) {
      showMessage(
        "Seçilen rapor, seçilen hayvan ile eşleşmiyor. Lütfen doğru bir rapor seçiniz."
      );
      return;
    }

    try {
      const newVaccineData = {
        name: newVaccineFormData.name,
        code: newVaccineFormData.code,
        protectionStartDate: newVaccineFormData.protectionStartDate,
        protectionFinishDate: newVaccineFormData.protectionFinishDate,
        animalId: newVaccineFormData.animalId,
        reportId: newVaccineFormData.reportId,
      };

      const newVaccine = await createVaccine(newVaccineData);
      setVaccines([...vaccines, newVaccine]);

      setNewVaccineFormData({
        name: "",
        code: "",
        protectionStartDate: "",
        protectionFinishDate: "",
        animalId: "",
        reportId: "",
      });
    } catch (error) {
      showMessage("Yeni Aşı oluşturulamadı:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleUpdate(selectedVaccine.id, updateFormData);
  };

  // FILTRE

  const [
    filterProtectionDateRangeFormData,
    setFilterProtectionDateRangeFormData,
  ] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredVaccines, setFilteredVaccines] = useState([]);

  const handleFilterByProtectionDateRange = (event) => {
    event.preventDefault();

    getVaccinesByProtectionDateRange(filterProtectionDateRangeFormData)
      .then((data) => {
        setFilteredVaccines(data);
      })
      .catch((error) => {
        showMessage(error);
      });
  };

  const handleProtectionDateRangeFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterProtectionDateRangeFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [filterAnimalFormData, setFilterAnimalFormData] = useState("");
  const handleAnimalFilterChange = (event) => {
    const { value } = event.target;
    setFilterAnimalFormData(value);
  };

  const handleFilterByAnimalVaccines = (event) => {
    event.preventDefault();

    getVaccineByAnimal(filterAnimalFormData)
      .then((data) => {
        if (data && data.length > 0) {
          setFilteredVaccines(data);
        } else {
          showMessage("Veri bulunamadı.");
        }
      })
      .catch((error) => {
        showMessage(error);
      });
  };
  return (
    <>
      <section>
        <br />
        <h1>Aşı Paneli</h1>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Aşı</TableCell>
                <TableCell>Kod</TableCell>
                <TableCell>Koruma Başlangıcı</TableCell>
                <TableCell>Koruma Bitişi</TableCell>
                <TableCell>Rapor ID</TableCell>
                <TableCell>Hayvan Adı</TableCell>
                <TableCell>Sil</TableCell>
                <TableCell>Güncelle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vaccines.map((vaccine) => (
                <TableRow key={vaccine.id}>
                  <TableCell>{vaccine.id}</TableCell>
                  <TableCell>{vaccine.name}</TableCell>
                  <TableCell>{vaccine.code}</TableCell>
                  <TableCell>
                    {formatDate(vaccine.protectionStartDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(vaccine.protectionFinishDate)}
                  </TableCell>
                  <TableCell>
                    {vaccine.reportId ? vaccine.reportId : "-"}
                  </TableCell>
                  <TableCell>{vaccine.animal.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(vaccine.id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateClick(vaccine)}
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
            <h2>Yeni Aşı Kayıt</h2>
            <form onSubmit={handleNewVaccineSubmit}>
              <h6>Aşı</h6>
              <input
                type="text"
                name="name"
                onChange={handleNewVaccineChange}
                value={newVaccineFormData.name}
              />
              <h6>Kodu</h6>
              <input
                type="text"
                name="code"
                onChange={handleNewVaccineChange}
                value={newVaccineFormData.code}
              />
              <h6>Koruma Başlangıç</h6>
              <input
                type="date"
                name="protectionStartDate"
                onChange={handleNewVaccineChange}
                value={newVaccineFormData.protectionStartDate}
              />
              <h6>Koruma Bitişi</h6>
              <input
                type="date"
                name="protectionFinishDate"
                onChange={handleNewVaccineChange}
                value={newVaccineFormData.protectionFinishDate}
              />

              <h6>Hayvan Seçiniz</h6>
              <select name="animalId" onChange={handleNewVaccineChange}>
                <option disabled selected>
                  Hayvan Seçiniz
                </option>
                {animals?.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    ID:{animal.id} {animal.name}
                  </option>
                ))}
              </select>
              <h6>Rapor Seçiniz</h6>
              <select name="reportId" onChange={handleNewVaccineChange}>
                <option disabled selected>
                  Rapor Seçiniz
                </option>
                {reports?.map((report) => (
                  <option key={report.id} value={report.id}>
                    ID:{report.id} {report.title} Hayvan ID: {report.animalId}
                  </option>
                ))}
              </select>

              <Button variant="contained" color="success" type="submit">
                Kaydet
              </Button>
            </form>
          </div>

          {selectedVaccine && (
            <div className="form-container">
              <h2>Aşı Güncelle</h2>
              <form onSubmit={handleSubmit}>
                <h6>Aşı</h6>
                <input
                  type="text"
                  name="name"
                  value={updateFormData.name}
                  onChange={handleUpdateChange}
                />
                <h6>Kodu</h6>
                <input
                  type="text"
                  name="code"
                  value={updateFormData.code}
                  onChange={handleUpdateChange}
                />
                <h6>Koruma Başlangıç</h6>
                <input
                  type="date"
                  name="protectionStartDate"
                  value={updateFormData.protectionStartDate}
                  onChange={handleUpdateChange}
                />
                <h6>Adres</h6>
                <input
                  type="date"
                  name="protectionFinishDate"
                  value={updateFormData.protectionFinishDate}
                  onChange={handleUpdateChange}
                />
                <h6>Hayvan Seçiniz</h6>
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
                <h6>Rapor Seçiniz</h6>
                <select
                  name="reportId"
                  onChange={handleUpdateChange}
                  value={updateFormData.reportId}
                >
                  <option disabled selected>
                    Rapor Seçiniz
                  </option>
                  {reports?.map((report) => (
                    <option key={report.id} value={report.id}>
                      ID:{report.id} {report.title} Hayvan ID: {report.animalId}
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
                  onClick={() => setSelectedVaccine(null)}
                >
                  İptal
                </Button>
              </form>
            </div>
          )}

          <div className="form-container">
            <h2>ID ile Aşı Ara</h2>
            <form onSubmit={handleGetById}>
              <input type="number" name="id" onChange={handleGetByIdChange} />
              <Button variant="contained" type="submit">
                Arama
              </Button>

              <h6>Aşı</h6>
              <input
                type="text"
                name="name"
                value={ByIdVaccine.name}
                disabled
              />
              <h6>Kodu</h6>
              <input
                type="text"
                name="code"
                value={ByIdVaccine.code}
                disabled
              />
              <h6>Koruma Başlangıç</h6>
              <input
                type="date"
                name="protectionStartDate"
                value={ByIdVaccine.protectionStartDate}
                disabled
              />
              <h6>Koruma Bitişi</h6>
              <input
                type="date"
                name="protectionFinishDate"
                value={ByIdVaccine.protectionFinishDate}
                disabled
              />
              <h6>Hayvan Adı</h6>
              <input
                type="text"
                name="animalName"
                value={ByIdVaccine.animalName}
                disabled
              />
              <h6>Rapor Id</h6>
              <input
                type="text"
                name="reportId"
                value={ByIdVaccine.reportId}
                disabled
              />
            </form>
          </div>
        </div>
        <div className="second-block">
          <div className="form-container">
            <h2>Koruma tarihlerine Göre Aşıları Filtrele</h2>
            <form onSubmit={handleFilterByProtectionDateRange}>
              <input
                type="date"
                name="startDate"
                value={filterProtectionDateRangeFormData.startDate}
                onChange={handleProtectionDateRangeFilterChange}
              />
              <input
                type="date"
                name="endDate"
                value={filterProtectionDateRangeFormData.endDate}
                onChange={handleProtectionDateRangeFilterChange}
              />

              <Button variant="contained" color="success" type="submit">
                Filtrele
              </Button>
            </form>
          </div>
          <div className="form-container">
            <h2>Hayvana Göre Aşıları Filtrele</h2>
            <form onSubmit={handleFilterByAnimalVaccines}>
              <h6>Hayvan Seçiniz</h6>
              <select name="id" onChange={handleAnimalFilterChange}>
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
                <TableCell>Aşı</TableCell>
                <TableCell>Kod</TableCell>
                <TableCell>Koruma Başlangıcı</TableCell>
                <TableCell>Koruma Bitişi</TableCell>
                <TableCell>Rapor ID</TableCell>
                <TableCell>Hayvan Adı</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVaccines.map((vaccine) => (
                <TableRow key={vaccine.id}>
                  <TableCell>{vaccine.id}</TableCell>
                  <TableCell>{vaccine.name}</TableCell>
                  <TableCell>{vaccine.code}</TableCell>
                  <TableCell>
                    {formatDate(vaccine.protectionStartDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(vaccine.protectionFinishDate)}
                  </TableCell>
                  <TableCell>
                    {vaccine.reportId ? vaccine.reportId : "-"}
                  </TableCell>
                  <TableCell>{vaccine.animal.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </>
  );
}

export default Vaccine;
