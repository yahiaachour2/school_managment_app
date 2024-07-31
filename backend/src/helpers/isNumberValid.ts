const phoneNumberRegex = /^(\+[1-9]{1}[0-9]{3,14})?([0-9]{9,14})$/;

export const isNumberValid = (phone: number) => {
  if (!phone) return false;

  // Convert the number to a string before testing
  const valid = phoneNumberRegex.test(phone.toString());
  if (!valid) return false;
  return true;
}