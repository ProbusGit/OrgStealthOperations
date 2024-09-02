import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";

const useHeader = () => {
  const {employeeDetails} = useAppSelector(state => state.employee);

  return {employeeDetails};
};
export default useHeader;

// import {useState, useEffect} from 'react';
// import {useAppSelector} from '../../../redux/hooks/hooks';
// import {useLazyGetUserDetailsQuery} from '../../../redux/services/user/userApiSlice';
// import { setEmployeeDetails } from '../../../redux/slices/emloyeeSlice';
// import {UserDetails} from '../../../redux/services/user/types';

// const useHeader = (userId: string) => {
//   const {employeeDetails} = useAppSelector(state => state.employee);
//   const [userDetails, setUserDetails] = useState<UserDetails>();
//   const [getUserDetails, userDetailsResult] = useLazyGetUserDetailsQuery();
//   useEffect(() => {
//     if (userId) {
//       fetchUserDetails();
//     } else {
//       setUserDetails(employeeDetails);
//     }
//   }, [employeeDetails, userId]);

//   const fetchUserDetails = async () => {
//     const userData = await getUserDetails(userId).unwrap();

//     if (userData?.data) {
//       setUserDetails(userData.data);
//     }
//   };
//   return {employeeDetails};
// };
// export default useHeader;
