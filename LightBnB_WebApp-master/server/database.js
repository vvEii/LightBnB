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
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties JOIN property_reviews ON properties.id = property_id
  `;
  const value = [];
  if (options.city) {
    value.push(`%${options.city}%`);
    // ILIKE is not case sensetive, since user may typy in vancouver, and '%vancouver%' would not return
    // any data from database due to the city in database is 'Vancouver'
    queryString += `WHERE city ILIKE $${value.length} `;
  }

  if (options.owner_id) {
    value.push(options.owner_id);
    queryString += `AND owner_id = $${value.length} `;
  }

  if (options.minimum_price_per_night) {
    //VERY TRICKY!! because the price in database is in cents
    value.push(options.minimum_price_per_night * 100);
    queryString += `AND cost_per_night >= $${value.length} `;
  }
  if (options.maximum_price_per_night) {
    //VERY TRICKY!! because the price in database is in cents
    value.push(options.maximum_price_per_night * 100);
    queryString += `AND cost_per_night <= $${value.length} `;
  }
  queryString += `GROUP BY properties.id\n`;
  if (options.minimum_rating) {
    value.push(options.minimum_rating);
    queryString += `HAVING avg(rating) >= $${value.length} `;
  }

  value.push(limit);

  queryString += ` 
  ORDER BY cost_per_night
  LIMIT $${value.length};`;
  console.log(value);
  console.log(queryString);
  return pool.query(queryString, value).then((res) => {
    console.log(res.rows);
    return res.rows;
  });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryString = `INSERT INTO properties (title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code) 
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *;`;
  const values = [
    property.title,
    property.description,
    property.owner_id,
    property.cover_photo_url,
    property.thumbnail_photo_url,
    property.cost_per_night * 100,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.province,
    property.city,
    property.country,
    property.street,
    property.post_code,
  ];
  return pool.query(queryString, values).then((res) => {
    console.log(res.rows);
    return res.rows;
  });
};
exports.addProperty = addProperty;
