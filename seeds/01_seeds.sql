INSERT INTO users
  (name,email,password)
VALUES('Tom', 'tom123@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Bob', 'bob123@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Cooper', 'cooper123@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties
  (owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night ,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active)
VALUES
  (1, 'Speed lamp', 'description', 'thumbnailURL', 'coverURL', 900, 10, 4, 5, 'Canada', 'street1', 'Vancouver', 'BC', 'V1J 7Y8', true),
  (2, 'Speed lamp2', 'description', 'thumbnailURL', 'coverURL', 1900, 20, 14, 15, 'Canada', 'street2', 'Vancouver', 'BC', 'V5J 7Y8', true),
  (3, 'Speed lamp3', 'description', 'thumbnailURL', 'coverURL', 2900, 30, 24, 25, 'Canada', 'street3', 'Toronto', 'BC', 'V2J 7Y8', true);

INSERT INTO reservations
  (guest_id, property_id, start_date, end_date)
VALUES
  (1, 1, '2018-09-11', '2018-09-26'),
  (2, 2, '2019-01-04', '2019-02-01'),
  (3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews
  (guest_id, property_id, reservation_id, rating, message)
VALUES
  (2, 2, 1, 3, 'message'),
  (1, 1, 2, 4, 'message'),
  (3, 3, 3, 4, 'message');

