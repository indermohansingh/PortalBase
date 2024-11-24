'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import ShowLoginOrLogout from '@/components/ShowLoginOrLogout';

type Item = {
    tenantid: number;
    tenantname: string;
};

const CrudPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [tenantname, setTenantname] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [session, setSession] = useState(useSession()?.data?.accessToken || '');
  const searchParams = useSearchParams();
  let tenantid = "-1";
  if (searchParams) tenantid = searchParams.get('tenantid') || ""; 

  const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/tenants?tenantid=${tenantid}` ;
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
    console.error('not supported');
    return;
    try {
      if (editingId !== null) {
        // Update
        await axios.put(`${apiUrl}/${editingId}`, { tenantname });
        setItems((prev) =>
          prev.map((item) =>
            item.tenantid === editingId ? { ...item, tenantname } : item
          )
        );
        setEditingId(null);
      } else {
        // Create
        const response = await axios.post(apiUrl, { tenantname });
        setItems((prev) => [...prev, response.data]);
      }
      setTenantname('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Edit
  const handleEdit = (tenantid: number) => {
    console.error('not supported');
    return;
    const itemToEdit = items.find((item) => item.tenantid === tenantid);
    if (itemToEdit) {
        setEditingId(tenantid);
      setTenantname(itemToEdit?.tenantname || '');
    }
  };

  // Delete
  const handleDelete = async (tenantid: number) => {
    console.error('not supported');
    return;
    try {
      await axios.delete(`${apiUrl}/${tenantid}`);
      setItems((prev) => prev.filter((item) => item.tenantid !== tenantid));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div>
        <ShowLoginOrLogout />
      </div>
      <h1>Tenants Management. Needs Manager role, which is roleid of 3.</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={tenantname}
          onChange={(e) => setTenantname(e.target.value)}
          placeholder="Enter "
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={handleSave} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          {editingId !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.tenantid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>{item.tenantid} - {item.tenantname}</span>
            <div>
              <button onClick={() => handleEdit(item.tenantid)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(item.tenantid)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudPage;
