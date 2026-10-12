-- Update earlier demo prices when an existing local database is reused.
UPDATE books SET price = CASE title
    WHEN 'The Map of Quiet Roads' THEN 399
    WHEN 'Letters from the Blue House' THEN 599
    WHEN 'A Season of Ordinary Days' THEN 349
    WHEN 'The Last Library Window' THEN 199
    WHEN 'Small Hours in June' THEN 429
    WHEN 'The Orchard at Number Nine' THEN 649
    WHEN 'The Coffee Shop Promise' THEN 379
    WHEN 'Dancing in the Rain Market' THEN 179
    WHEN 'The Summer We Said Hello' THEN 419
    WHEN 'A Recipe for Two' THEN 579
    WHEN 'Postcards to My Neighbor' THEN 349
    WHEN 'The Bookshop on Rose Street' THEN 219
    WHEN 'The Clockmaker''s Clue' THEN 389
    WHEN 'A Note in the Conservatory' THEN 629
    WHEN 'The Case of the Missing Menu' THEN 189
    WHEN 'Footprints at Gull Point' THEN 449
    WHEN 'Murder at Maple Hall' THEN 399
    WHEN 'The Envelope under the Floor' THEN 679
    WHEN 'The Lantern Keeper''s Quest' THEN 429
    WHEN 'The Isles Beyond the Clouds' THEN 699
    WHEN 'The Greenhouse of Starlight' THEN 229
    WHEN 'The Fox and the Moonwell' THEN 369
    WHEN 'The Clockwork Forest' THEN 649
    WHEN 'A Crown Made of Ferns' THEN 459
    WHEN 'Make Room for Good Habits' THEN 429
    WHEN 'A Kinder Inner Voice' THEN 599
    WHEN 'The Calm Week Planner' THEN 379
    WHEN 'Start Where You Are Today' THEN 169
    WHEN 'Listening with Curiosity' THEN 489
    WHEN 'A Pocket Guide to Focus' THEN 199
    ELSE price
END
WHERE price < 100;

-- Keep previously seeded book covers aligned with the current blue and coral theme.
UPDATE books SET cover_color = CASE title
    WHEN 'The Map of Quiet Roads' THEN '#e4ebf3'
    WHEN 'The Summer We Said Hello' THEN '#f2dfcf'
    WHEN 'Small Hours in June' THEN '#e8edf4'
    WHEN 'The Orchard at Number Nine' THEN '#e8edf4'
    WHEN 'The Clockmaker''s Clue' THEN '#e6eaf0'
    WHEN 'A Note in the Conservatory' THEN '#e0e9f2'
    WHEN 'The Case of the Missing Menu' THEN '#e8edf4'
    WHEN 'The Lantern Keeper''s Quest' THEN '#f2dfcf'
    WHEN 'The Greenhouse of Starlight' THEN '#dce8f5'
    WHEN 'The Clockwork Forest' THEN '#e1e8f0'
    WHEN 'A Crown Made of Ferns' THEN '#e8edf4'
    WHEN 'Make Room for Good Habits' THEN '#f2dfcf'
    WHEN 'Start Where You Are Today' THEN '#e7eaf2'
    ELSE cover_color
END
WHERE title IN (
    'The Map of Quiet Roads', 'The Summer We Said Hello', 'Small Hours in June', 'The Orchard at Number Nine',
    'The Clockmaker''s Clue', 'A Note in the Conservatory', 'The Case of the Missing Menu',
    'The Lantern Keeper''s Quest', 'The Greenhouse of Starlight', 'The Clockwork Forest',
    'A Crown Made of Ferns', 'Make Room for Good Habits', 'Start Where You Are Today'
);

INSERT INTO books (title, author, category, publisher, format, price, description, cover_color)
SELECT seed.title, seed.author, seed.category, seed.publisher, seed.format, seed.price, seed.description, seed.cover_color
FROM (VALUES
    ('The Map of Quiet Roads', 'Mira Ellis', 'Fiction', 'North Pine Press', 'Paperback', 399, 'A small-town cartographer discovers that the roads she draws connect more than places.', '#e4ebf3'),
    ('Letters from the Blue House', 'Jonah Reed', 'Fiction', 'Harborlight Books', 'Hardcover', 599, 'A family sorts through a seaside home and the stories its rooms have kept.', '#dce8f5'),

    ('The Coffee Shop Promise', 'Ava Morgan', 'Romance', 'Clover Lane', 'Paperback', 379, 'A careful planner and a free-spirited barista team up to save their favorite cafe.', '#f6d9df'),
    ('Dancing in the Rain Market', 'Leo Bennett', 'Romance', 'Harborlight Books', 'E-book', 179, 'A chance meeting at a weekend market turns into a warm and hopeful friendship.', '#d8e8f5'),

    ('The Clockmaker''s Clue', 'R. J. Harper', 'Mystery', 'Lantern House', 'Paperback', 389, 'A repair apprentice notices a pattern in the clocks brought to the old workshop.', '#e6eaf0'),
    ('A Note in the Conservatory', 'Maya Brooks', 'Mystery', 'North Pine Press', 'Hardcover', 629, 'A community gardener investigates who keeps leaving unsigned notes among the plants.', '#e0e9f2'),

    ('The Lantern Keeper''s Quest', 'Arin Wells', 'Fantasy', 'Starling Books', 'Paperback', 429, 'A young keeper follows a trail of glowing lanterns into a hidden valley.', '#f2dfcf'),
    ('The Isles Beyond the Clouds', 'S. L. Rowan', 'Fantasy', 'Starling Books', 'Hardcover', 699, 'A mapmaker and a sky sailor search for islands said to move with the wind.', '#d3e3f3'),

    ('Make Room for Good Habits', 'Jamie Park', 'Self-help', 'Bright Steps', 'Paperback', 429, 'A practical guide to building routines that fit real life, one small step at a time.', '#f2dfcf'),
    ('A Kinder Inner Voice', 'Morgan Ellis', 'Self-help', 'Bright Steps', 'Hardcover', 599, 'Gentle exercises for noticing self-talk and responding with more patience.', '#eadbf1')
) AS seed(title, author, category, publisher, format, price, description, cover_color)
WHERE NOT EXISTS (SELECT 1 FROM books);
