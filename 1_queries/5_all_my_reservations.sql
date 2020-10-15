--show all reservations for user with id = 1
SELECT properties.id AS id, title, cost_per_night, start_date, AVG(rating) AS average_rating
FROM reservations JOIN properties ON property_id = properties.id
  JOIN property_reviews ON reservations.id = property_reviews.reservation_id
WHERE end_date < now()
::date AND reservations.guest_id = 67
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;

--properties.id = property_reviews.property_id get diffrent result, so join two tables with diffrent id get diffrent tables?