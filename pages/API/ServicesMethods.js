import axios from 'axios';

const BaseUrl = 'https://devapi.fleatiger.com';
// const BaseUrl = "https://api.fleatiger.com";
//  const TrackerBaseUrl = "https://iot.omnibike.net"
const TrackerBaseUrl = 'https://dashboard.fleatiger.com';
// const BaseUrl ='http://20.73.58.161:4000'



export const executePost = async (endpoint, data) => {
  const header= {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer YOUR_TOKEN`, // If required
  };
  return await axios.post(BaseUrl + endpoint, data);
};

export const executeGET = async endPoint => {
  const header= {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': `Bearer YOUR_TOKEN`, // If required
  };
  return await axios.get(BaseUrl + endPoint);
};

export const executeTracker = async endpoint => {
  return await axios.get(TrackerBaseUrl + endpoint);
};
