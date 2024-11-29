'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import ShowLoginOrLogout from '@/components/ShowLoginOrLogout';
import ReactJsonPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import { JSONTree } from 'react-json-tree';

const CrudPage: React.FC = () => {
  const [englishquery, setEnglishquery] = useState<string>('');
  const [esDSL, setEsDSL] = useState<string>('');
  const [esResult, setEsResult] = useState<string>('');
  const [session, setSession] = useState(useSession()?.data?.accessToken || '');
  const searchParams = useSearchParams();
  let tenantid = "-1";
  if (searchParams) tenantid = searchParams.get('tenantid') || ""; 

  const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/getesdsl` ;

  let x = useSession()?.data?.accessToken || '';
  if (x!=session ) setSession(x);

    // Create or Update
    const handleGetQuery = async () => {
      try {
        setEsDSL("")
        setEsResult("")
        if (englishquery !== null) {
          // Update
          const results = await axios.post(`${apiUrl}`, { englishquery });
          setEsDSL(results.data.dslQry.query)
          setEsResult(results.data.dslQry.result)
        } 
      } catch (error) {
        console.error('Error getting Query:', error);
      }
    };
  

  return (
    <div className=''>
        <div>
          <ShowLoginOrLogout />
        </div>
        <div>
        <h1>Elastic DSL by Open AI</h1>
        <br></br>
        <div style={{ marginBottom: '20px' }}>
        <textarea 
            rows={5}
            value={englishquery}
            onChange={(e) => setEnglishquery(e.target.value)}
            placeholder="Enter Named Query"
            style={{ overflow: "scroll",  width: "70%", padding: '8px' }}
          />
          <button onClick={handleGetQuery} style={{ padding: '8px 16px', marginLeft: '10px' }}>
            {'GetQuery'}
          </button>
        </div>
        <br></br>
        <div style={{ marginBottom: '20px' }}>
          <textarea 
            rows={5}
            value={esDSL}
            placeholder="DSL comes here"
            style={{ overflow: "scroll",  width: "70%", padding: '8px' }}
          />
        </div>
        <br></br>
        <div
          style={{
            height: "480px", // Approximate height for 5 rows (adjust as needed)
            width: "100%",
            overflow: "auto", // Enable scrollbars for both axes
            border: "1px solid #ccc", // Optional: Add a border for better visuals
            borderRadius: "4px", // Optional: Slight rounding of corners
            padding: "10px", // Optional: Add some padding inside the box
            backgroundColor: "#f9f9f9", // Optional: Background color for better visuals
          }}
        >
          <JSONTree data={esResult}  />
        </div>
        <br></br>
        </div>
    </div>
  );
};

export default CrudPage;





