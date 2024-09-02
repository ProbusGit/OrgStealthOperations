interface UserDetails {
  id: number; // Adjust as per your actual API response
  employeeName: string;
  joiningDate: string;
  address: string;
  emailID: string;
  mobileNo: string;
  birthDate: string;
  churchName: string;
  photo: string;
  role:string;
  // Add other fields as per your API response
}

interface UserDetailsResponse {
  message: string;
  status: number;
  data: UserDetails;
}

export type {UserDetailsResponse, UserDetails};
