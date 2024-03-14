import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  deleteCustomer,
  getCustomers,
  updateCustomer,
  createCustomer,
  getCustomer,
} from "../../API/Customer";
import { useState, useEffect } from "react";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [id, setId] = useState("");
  const handleGetByIdChange = (event) => {
    setId(event.target.value);
  };
  const handleGetById = async (event) => {
    event.preventDefault();

    try {
      const customerWithId = await getCustomer(id);

      setByIdCustomer({
        name: customerWithId.name,
        phone: customerWithId.phone,
        email: customerWithId.email,
        address: customerWithId.address,
        city: customerWithId.city,
      });
    } catch (error) {
      console.error(error.response.data.message);
      setByIdCustomer({
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

  const [newCustomerFormData, setNewCustomerFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [ByIdCustomer, setByIdCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const handleNewCustomerChange = (event) => {
    const { name, value } = event.target;
    setNewCustomerFormData((prevFormData) => ({
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
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((customer) => customer.id !== id));
      console.log(`Customer with ID ${id} has been deleted.`);
    } catch (error) {
      console.log(`Error deleting customer with ID ${id}:`, error);
    }
  };

  const handleUpdate = async (id, updatedCustomer) => {
    try {
      const updatedData = await updateCustomer(updatedCustomer, id);
      setCustomers(
        customers.map((customer) => {
          if (customer.id === id) {
            return { ...customer, ...updatedData };
          }
          return customer;
        })
      );

      setSelectedCustomer(null);
      setUpdateFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.log(`Error updating customer with ID ${id}:`, error);
    }
  };

  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setUpdateFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
    });
  };

  const handleNewCustomerSubmit = async (event) => {
    event.preventDefault();
    try {
      const newCustomerData = {
        name: newCustomerFormData.name,
        phone: newCustomerFormData.phone,
        email: newCustomerFormData.email,
        address: newCustomerFormData.address,
        city: newCustomerFormData.city,
      };

      const newCustomer = await createCustomer(newCustomerData);
      setCustomers([...customers, newCustomer]);

      setNewCustomerFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
      });
    } catch (error) {
      console.error("Error adding new customer:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(selectedCustomer.id, updateFormData);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateClick(customer)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="container">
        <div className="form-container">
          <h2>New Customer</h2>
          <form onSubmit={handleNewCustomerSubmit}>
            <h6>Name</h6>
            <input
              type="text"
              name="name"
              onChange={handleNewCustomerChange}
              value={newCustomerFormData.name}
            />
            <h6>Phone</h6>
            <input
              type="text"
              name="phone"
              onChange={handleNewCustomerChange}
              value={newCustomerFormData.phone}
            />
            <h6>Email</h6>
            <input
              type="text"
              name="email"
              onChange={handleNewCustomerChange}
              value={newCustomerFormData.email}
            />
            <h6>Address</h6>
            <input
              type="text"
              name="address"
              onChange={handleNewCustomerChange}
              value={newCustomerFormData.address}
            />
            <h6>City</h6>
            <input
              type="text"
              name="city"
              onChange={handleNewCustomerChange}
              value={newCustomerFormData.city}
            />
            <Button variant="contained" color="success" type="submit">
              Add New Customer
            </Button>
          </form>
        </div>
        <div className="form-container">
          {selectedCustomer && (
            <div className="form-container">
              <h2>Update Customer</h2>
              <form onSubmit={handleSubmit}>
                <h6>Name</h6>
                <input
                  type="text"
                  name="name"
                  value={updateFormData.name}
                  onChange={handleUpdateChange}
                />
                <h6>Phone</h6>
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
                <h6>Address</h6>
                <input
                  type="text"
                  name="address"
                  value={updateFormData.address}
                  onChange={handleUpdateChange}
                />
                <h6>City</h6>
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
                    onClick={() => setSelectedCustomer(null)}
                  >
                    İptal
                  </Button>
                
              </form>
            </div>
          )}
        </div>
        <div className="form-container">
          <h2>Customer by ID</h2>
          <form onSubmit={handleGetById}>
            <div>
              <input type="number" name="id" onChange={handleGetByIdChange} />
              <Button variant="contained" type="submit">
                ID Search
              </Button>
            </div>
          </form>

          <h6>Name</h6>
          <input type="text" name="name" value={ByIdCustomer.name} disabled />
          <h6>Phone</h6>
          <input type="text" name="phone" value={ByIdCustomer.phone} disabled />
          <h6>Email</h6>
          <input type="text" name="email" value={ByIdCustomer.email} disabled />
          <h6>Address</h6>
          <input
            type="text"
            name="address"
            value={ByIdCustomer.address}
            disabled
          />
          <h6>City</h6>
          <input type="text" name="city" value={ByIdCustomer.city} disabled />
        </div>
      </div>
    </>
  );
}

export default Customer;
