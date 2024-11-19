'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

type Item = {
    userid: number;
  email: string;
};

const CrudPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [email, setEmail] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [session, setSession] = useState(useSession()?.data?.accessToken || '');

  const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/users` ;
  let x = useSession()?.data?.accessToken || '';
  if (x!=session ) setSession(x);

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      if (!session) return;
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
        await axios.put(`${apiUrl}/${editingId}`, { email });
        setItems((prev) =>
          prev.map((item) =>
            item.userid === editingId ? { ...item, email } : item
          )
        );
        setEditingId(null);
      } else {
        // Create
        const response = await axios.post(apiUrl, { email });
        setItems((prev) => [...prev, response.data]);
      }
      setEmail('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Edit
  const handleEdit = (userid: number) => {
    const itemToEdit = items.find((item) => item.userid === userid);
    if (itemToEdit) {
        console.log(userid)
        setEditingId(userid);
      setEmail(itemToEdit.email);
    }
  };

  // Delete
  const handleDelete = async (userid: number) => {
    try {
      await axios.delete(`${apiUrl}/${userid}`);
      setItems((prev) => prev.filter((item) => item.userid !== userid));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>Users Management</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter "
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={handleSave} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          {editingId !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.userid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>{item.email}</span>
            <div>
              <button onClick={() => handleEdit(item.userid)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(item.userid)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudPage;
