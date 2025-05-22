
// Function to generate unique user ID based on DOB and timestamp
export function generateUserID(dob: Date): string {
  // Extract date components from the date picker value
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();
  
  // Format DOB part as DDMMYYYY
  const dobPart = `${day}${month}${year}`;
  
  // Get current timestamp and take last 4 digits
  const timestamp = new Date().getTime().toString();
  const uniquePart = timestamp.slice(-4);
  
  // Combine to create final ID
  return `${dobPart}_${uniquePart}`;
}

// Function to check if an ID matches a specific date of birth
export function doesIdMatchDOB(id: string, dob: Date): boolean {
  // Extract the DOB part from the ID (DDMMYYYY)
  const dobPart = id.split('_')[0];
  
  // Format the provided DOB in the same format
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();
  
  const formattedDOB = `${day}${month}${year}`;
  
  // Compare
  return dobPart === formattedDOB;
}

// Function to export user data to a JSON file
export function exportUserData(userData: any): void {
  const dataStr = JSON.stringify(userData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileName = `${userData.name}_mantra_identity.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();
  linkElement.remove();
}
