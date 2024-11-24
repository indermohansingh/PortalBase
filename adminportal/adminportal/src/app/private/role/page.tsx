'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

type Item = {
  roleid: number;
  rolename: string;
};

const CrudPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [rolename, setRolename] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [session, setSession] = useState(useSession()?.data?.accessToken || '');

  const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/roles` ;
  let x = useSession()?.data?.accessToken || '';
  if (x!=session ) setSession(x);

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session}`,
        }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [session]);

  // Create or Update
  const handleSave = async () => {
    try {
      if (editingId !== null) {
        // Update
        await axios.put(`${apiUrl}/${editingId}`, { rolename });
        setItems((prev) =>
          prev.map((item) =>
            item.roleid === editingId ? { ...item, rolename } : item
          )
        );
        setEditingId(null);
      } else {
        // Create
        const response = await axios.post(apiUrl, { rolename });
        setItems((prev) => [...prev, response.data]);
      }
      setRolename('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Edit
  const handleEdit = (roleid: number) => {
    const itemToEdit = items.find((item) => item.roleid === roleid);
    if (itemToEdit) {
        setEditingId(roleid);
      setRolename(itemToEdit.rolename);
    }
  };

  // Delete
  const handleDelete = async (roleid: number) => {
    try {
      await axios.delete(`${apiUrl}/${roleid}`);
      setItems((prev) => prev.filter((item) => item.roleid !== roleid));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>Roles Management</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={rolename}
          onChange={(e) => setRolename(e.target.value)}
          placeholder="Enter "
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={handleSave} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          {editingId !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.roleid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>{item.roleid} - {item.rolename}</span>
            <div>
              <button onClick={() => handleEdit(item.roleid)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(item.roleid)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudPage;
