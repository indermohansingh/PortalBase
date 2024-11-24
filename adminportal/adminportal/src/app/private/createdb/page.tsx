'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import ShowLoginOrLogout from '@/components/ShowLoginOrLogout';

type Item = {
  domain: string;
  realm: string;
};

const CrudPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [session, setSession] = useState(useSession()?.data?.accessToken || '');
  const searchParams = useSearchParams();
  let tenantid = "-1";
  if (searchParams) tenantid = searchParams.get('tenantid') || ""; 

  const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/createdb` ;

  let x = useSession()?.data?.accessToken || '';
  if (x!=session ) setSession(x);

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const response = await axios.post(apiUrl, {
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


  return (
    <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
        <div>
          <ShowLoginOrLogout />
        </div>
        <div>
        <h1>DB Created</h1>
        <br></br>
        {JSON.stringify(items)}
        </div>
    </div>
  );
};

export default CrudPage;





