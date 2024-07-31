import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => {
  let salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};



export function checkPassword(inputPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}