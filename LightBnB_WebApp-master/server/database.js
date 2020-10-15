const properties = require('./json/properties.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: 'vagrant',
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `SELECT * FROM users WHERE email = $1;`;
  const value = email;
  return pool.query(queryString, [value]).then((res) => {
    return res.rows.length === 0 ? null : res.rows[0];
  });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `SELECT * FROM users WHERE id = $1;`;
  const value = [id];
  return pool.query(queryString, value).then((res) => {
    return res.rows.length === 0 ? null : res.rows[0];
  });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *;`;
  const name = user.name;
  const email = user.email;
  const password = user.password;
  const value = [name, email, password];
  return pool.query(queryString, value).then((res) => {
    res.rows[0];
  });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.id AS id, title, cost_per_night, start_date, AVG(rating) AS average_rating
FROM reservations JOIN properties ON property_id = properties.id
  JOIN property_reviews ON reservations.id = property_reviews.reservation_id
WHERE end_date < now()
::date AND reservations.guest_id = $1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT $2;`;
  const value = [guest_id, limit];
  return pool.query(queryString, value).then((res) => res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryString = `
  SELECT * FROM properties LIMIT $1;
  `;
  const value = [limit];
  return pool.query(queryString, value).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
