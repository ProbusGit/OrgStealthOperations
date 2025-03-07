import { useState } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
// import { useGetNotificationCountQuery } from "../../redux/services/notifications";


const useHeader = () => {
  const {employeeDetails} = useAppSelector(state => state.employee);
  // const {data:ntfCount,}=useGetNotificationCountQuery(null);


  return 
};
export default useHeader;
