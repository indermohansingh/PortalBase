'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

type Item = {
  domain: string;
  realm: string;
};

const CrudPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [domain, setDomain] = useState<string>('');
  const [realm, setRealm] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [session, setSession] = useState(useSession()?.data?.accessToken || '');

  const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/domainrealmmapping` ;

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
        await axios.put(`${apiUrl}/${editingId}`, { realm });
        setItems((prev) =>
          prev.map((item) =>
            item.domain === editingId ? { ...item, realm } : item
          )
        );
        setEditingId(null);
      } else {
        // Create
        const response = await axios.post(apiUrl, { domain, realm });
        setItems((prev) => [...prev, response.data]);
      }
      setRealm('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Edit
  const handleEdit = (domain: string) => {
    const itemToEdit = items.find((item) => item.domain === domain);
    if (itemToEdit) {
        setEditingId(domain);
      setRealm(itemToEdit.realm);
      setDomain(itemToEdit.domain)
    }
  };

  // Delete
  const handleDelete = async (domain: string) => {
    try {
      await axios.delete(`${apiUrl}/${domain}`);
      setItems((prev) => prev.filter((item) => item.domain !== domain));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1>Domain/Realm Management</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter Domain"
          style={{ padding: '8px', width: '70%' }}
        />
        <input
          type="text"
          value={realm}
          onChange={(e) => setRealm(e.target.value)}
          placeholder="Enter Realm"
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={handleSave} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          {editingId !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.domain} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>{item.domain} - {item.realm}</span>
            <div>
              <button onClick={() => handleEdit(item.domain)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(item.domain)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudPage;
