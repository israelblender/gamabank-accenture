const JWT = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const generate = (userData) =>
  new Promise((resolve) => {
    JWT.sign(
      userData,
      "keytest",
      { algorithm: "HS256", expiresIn: "20m" },
      (err, token) => {
        if (err) {
          throw new Error("ERR_INVALID_TOKEN");
        }

        resolve(token);
      }
    );
  });

const validate = async (decoded) => {
  const { userId } = decoded;

  const user = await userRepository.findUserByEmail(userId);

  if (!user) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

module.exports = {
  generate,
  validate,
};
