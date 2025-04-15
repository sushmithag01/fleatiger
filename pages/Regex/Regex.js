const Regex = {
     PasswordTest :/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})/,
     EmailTest:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
     HeightWeightTest:/^\d*\.?\d*$/,
     OnlyNumberTest : /^[0-9]*$/,
}
export default Regex;