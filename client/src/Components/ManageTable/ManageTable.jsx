import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import './ManageTable.css';
import axios from 'axios';

const ManageTable = () => {
  const [tables, setTables] = useState([]);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State for storing the selected image

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('/api/reservation/tables');

      if (response.status === 200) {
        setTables(response.data);
      } else {
        setError('Failed to fetch table data');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the table data.');
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`/api/reservation/tables/edit/${id}`);

      if (response.status === 200) {
        setEditFormVisible(true);
        setEditFormData(response.data);
      } else {
        setError('Failed to fetch table data for editing');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the table data for editing.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        const response = await axios.delete(`/api/reservation/tables/delete/${id}`);

        if (response.status === 200) {
          setMessage('Table deleted successfully');
          fetchTables();
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while deleting the table.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { id, tableName, maxLimit, tableType, price, Newimage, description } = e.target.elements;
    const formData = new FormData();
  
    formData.append('tableName', tableName.value);
    formData.append('maxLimit', maxLimit.value);
    formData.append('tableType', tableType.value);
    formData.append('price', price.value);
    formData.append('description', description.value);
  
    if (Newimage.files && Newimage.files.length > 0) {
      formData.append('image', Newimage.files[0]);
    }
  
    try {
      const response = await axios.put(`/api/reservation/tables/update/${id.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        setEditFormVisible(false);
        setMessage('Table updated successfully');
        fetchTables();
        setEditFormData(response.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the table.');
    }
  };
  
  const img_baseURL = '/Dinner/';

  return (
    <div className="MNT-div">
      <h2>Manage Dinner Reservation Table</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Limit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table._id}>
              <td>{table.tableName}</td>
              <td>{table.price}</td>
              <td>{table.tableType}</td>
              <td>{table.maxLimit}</td>
              <td>
                <button className="cbtn green" onClick={() => handleEdit(table._id)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button className="cbtn red" onClick={() => handleDelete(table._id)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editFormVisible && (
        <form className="edt-MNT" onSubmit={handleFormSubmit}>
          <input type="hidden" name="id" value={editFormData._id} />
          <div>
            <label htmlFor="tableName">Table Name:</label>
            <input type="text" name="tableName" defaultValue={editFormData.tableName} required />
          </div>
          <div>
            <label htmlFor="maxLimit">Max Limit:</label>
            <input type="number" name="maxLimit" defaultValue={editFormData.maxLimit} required />
          </div>
          <div>
            <label htmlFor="tableType">Table Type:</label>
            <input type="text" name="tableType" defaultValue={editFormData.tableType} required />
          </div>
          <div>
            <label htmlFor="price">Price (GHS):</label>
            <input type="number" name="price" defaultValue={editFormData.price} required />
          </div>
          <div>
  {selectedImage ? (
    <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
  ) : editFormData && editFormData.image ? (
    <img src={img_baseURL + editFormData.image + `?${Date.now()}`} alt="Previous Image" />
  ) : null}
  <label htmlFor="Newimage">
    <FontAwesomeIcon className="writeicon" icon={faAdd} />
    Edit Image
  </label>
  <input
    type="file"
    id="Newimage"
    name="Newimage"
    style={{ display: 'none' }}
    accept="image/*"
    onChange={(e) => setSelectedImage(e.target.files && e.target.files[0])}
  />
</div>


          <div>
            <label htmlFor="description">Description:</label>
            <textarea name="description" defaultValue={editFormData.description} required />
          </div>
          <button className="cbtn black" type="submit">
            Update
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageTable;
