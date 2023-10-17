import password from "secure-random-password";

/**
 *
 * @param {string} password
 * this function provides the percent value of pasword strength comparing it on different
 * @returns
 */

export const checkPasswordStrength = (password) => {
  var strength = 0;
  if (password.length >= 8) {
    strength += 1;
  }
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  if (/[a-z]/.test(password)) {
    strength += 1;
  }
  if (/\d/.test(password)) {
    strength += 1;
  }
  if (/[$@#&!]/.test(password)) {
    strength += 1;
  }
  return strength;
};

export const generatePassword = () => {
  return password.randomPassword({
    length: Math.floor(Math.random() * (20 - 8)) + 8,
    characters: [
      password.lower,
      password.upper,
      password.digits,
      "!@#$%^&*()[]{}-_+=:;\<>?,./|",
    ],
  });
};
