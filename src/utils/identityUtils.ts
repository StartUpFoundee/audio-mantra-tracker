
// Function to generate unique user ID based on DOB and timestamp
export function generateUserID(dob: Date, name: string): string {
  // Extract date components from the date picker value
  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();
  
  // Format DOB part as DDMMYYYY
  const dobPart = `${day}${month}${year}`;
  
  // Get name initials (first 2 characters uppercase)
  const nameInitials = name.substring(0, 2).toUpperCase();
  
  // Get current timestamp and take last 4 digits
  const timestamp = new Date().getTime().toString();
  const uniquePart = timestamp.slice(-4);
  
  // Combine to create final ID
  return `${dobPart}_${nameInitials}_${uniquePart}`;
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

// Function to check if ID matches name initials
export function doesIdMatchName(id: string, name: string): boolean {
  // Extract the name initials part from the ID
  const parts = id.split('_');
  if (parts.length < 2) return false;
  
  const nameInitialsPart = parts[1];
  
  // Get the first 2 characters of the provided name (uppercase)
  const nameInitials = name.substring(0, 2).toUpperCase();
  
  // Compare
  return nameInitialsPart === nameInitials;
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
