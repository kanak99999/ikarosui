import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import axiosInstance from '../axiosClient';
import {ManagerOptionsApiResponse} from '@/types/managerOptions'
export default function PartnerPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [error, setError] = useState<string | null>(null);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();

    const handleSubmit = async (e:any) => {
      e.preventDefault();
      try {
        const data = {
          "username": user,
          "password": password,
          "email": email,
          "clientId": null
        }
        const response = await axios.post(apiBaseUrl+'/auth/generateToken',data);
        localStorage.setItem("iToken", response.data.accessToken);
        console.log(response.data.accessToken);
        router.push('/');
      } catch (err) {
        setError('Invalid credentials');
      }
    };

    useEffect(()=>{
        const response = axiosInstance.get<ManagerOptionsApiResponse>(apiBaseUrl+'/options/managers?entityTypeId=3');
        console.log(JSON.stringify(response));
    },[]);
    return (
      <div>
        <h1>Login</h1>
        
        <form onSubmit={handleSubmit}>
          <label>Id</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Name</label>
          <label>Alias</label>
          <label>Business Class:</label>
          <label>Business Category</label>
          <label>Established Date:</label>
          <label>Manager:</label>
          <label>Reviewer</label>
          <label>User Roles</label>
          <label>Industry Type</label>
          <label>Screens</label>
          <label>Average Selling Price</label>
          <label>Location</label>
          <label>Email</label>
          <input type="username" value={user} onChange={(e) => setUser(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }


  