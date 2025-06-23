// Regex for base32 string for testing reset code
const RESET_CODE_REGEX = /^\d{6}$/ // /^[A-Z2-7]{5}-[A-Z2-7]{5}$/

export function checkAndFormatResetCode(code: string): string | false {
  // Trim the reset code
  let fixed = code.trim().toUpperCase()

  // Add a dash if needed
  // if (fixed.length === 10) {
  //   fixed = `${fixed.slice(0, 5)}-${fixed.slice(5, 10)}`
  // }

  // Check that it is a valid format
  if (!RESET_CODE_REGEX.test(fixed)) {
    return false
  }

  return fixed
}

export type PASS_VALIDATE_TYPE = 'NO_PASS' | 'SHORT_PASS' | 'VALID'

export function checkPassword(password: string | undefined): {
  type: PASS_VALIDATE_TYPE
  message: string
} {
  if (!password) return {type: 'NO_PASS', message: '请输入密码'}
  if (password.length < 8) {
    return {type: 'SHORT_PASS', message: '密码应至少包含8个字符'}
  }
  return {type: 'VALID', message: ''}
}
