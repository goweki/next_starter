// Imports used in cssHandlers
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// Import used in password handlers
import bcrypt from "bcryptjs";

/**
 * Merges class names using Tailwind CSS and classnames.
 * @param {...ClassValue[]} inputs - Class names or conditional expressions.
 * @returns {string} - The merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

//
//
//
// PASSWORD HANDLERS

/**
 * Hashes a string.
 * @param plaintext - String to be hashed.
 * @returns corresponding hash value.
 */
export async function hash(plaintext: string): Promise<string> {
  const saltRounds = Number(process.env.BCRYPT_SALTROUNDS);
  if (!saltRounds) throw new Error("env variable missing: BCRYPT_SALTROUNDS");
  const hash = await bcrypt.hash(plaintext, saltRounds);
  return hash;
}

/**
 * Compares plaintext to hash.
 * @param input - plaintext.
 * @param hash - hash value to be compared against.
 * @returns `true` if hash is hashed input, otherwise `false`.
 */
export async function compareHash(
  input: string,
  hash: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(input, hash);
  return isValid;
}

/**
 * Parses Date object to human readable format
 * @param _date - Date object to be parsed.
 * @returns string representation of the input new Date() object
 */
export function dateShort(_date: Date): string {
  return new Intl.DateTimeFormat("en-GB").format(_date);
}

//
//
//
// DATE HANDLERS

/**
 * checks if Date has passed
 * @param _date - Date object to be checked.
 * @returns `true` if Date has passed, otherwise `false`.
 */
export function isDatePassed(_date: Date): boolean {
  if (new Date() > _date) return true;
  else return false;
}

/**
 * Calculates the difference in hours between two Date objects.
 * @param _dateA - The first Date object.
 * @param _dateB - The second Date object to be subtracted.
 * @returns The difference in hours (positive if _dateA is later than _dateB, negative otherwise).
 */
export function hoursDifference(_dateA: Date, _dateB: Date): number {
  return (_dateA.getTime() - _dateB.getTime()) / 3600000;
}

//
//
//
// INPUT VALIDATORS

/**
 * Validates an email address using a regular expression.
 * @param email - The email address to validate.
 * @returns Returns "invalid email" if the email is invalid, otherwise returns null.
 */
export function emailValidator(email: string): string | null {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return "invalid email";
  else return null;
}

/**
 * Validates password
 * @param password - The password to validate.
 * @returns Returns validation error if the password is invalid, otherwise returns null.
 */
export function passwordValidator(password: string, confirmPassword?: string) {
  if (!password) {
    return "Password can't be empty";
  } else if (password.length < 5) {
    return "Password must be at least 5 characters long";
  } else if (confirmPassword && password !== confirmPassword) {
    return "Passwords do not match";
  } else return "";
}

/**
 * Validates an name.
 * @param name - The string to validate.
 * @returns Returns validation error if the name is invalid, otherwise returns null.
 */
export function nameValidator(name: string) {
  const re = /[a-zA-Z]/;
  if (!name) {
    return "Name field can't be empty";
  } else if (name.length < 3) {
    return "Name too short";
  } else if (!re.test(name)) {
    return "Names should contain alphabets only";
  } else return "";
}

/**
 * Camel case a string.
 * @param str - The string to camel case.
 * @returns string in camel case.
 */
export function camelCase(str: string) {
  // Using replace method with regEx
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Trancates prose to given limit
 * @param _prose - string to truncate
 * @param limit - charater limit after which truncation will occur
 * @returns truncated prose if prose exceeds limit, otherwise prose
 */
export function truncateStr(_prose: string, limit: number) {
  if (_prose.length <= limit) return _prose;
  let sliceIndex = limit;
  while (sliceIndex < _prose.length && /\b/.test(_prose[sliceIndex]))
    sliceIndex++;
  return _prose.slice(0, sliceIndex) + "...";
}

/**
 * Title case a string.
 * @param str - The string to title case.
 * @returns string in title case.
 */
export function titleCase(str: string) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

//
//
//
// URL HANDLERS

/**
 * Returns the canonical URL based on the current environment.
 * @returns {string} The canonical URL.
 */
export function getCanonicalURL(): string {
  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "production") {
    return "https://bunge-scope.vercel.app"; // live server
  } else if (nodeEnv === "development") {
    return "http://localhost:3000"; // development server
  } else {
    return "http://localhost:3000"; //other environments (e.g., staging, testing) as needed
  }
}
