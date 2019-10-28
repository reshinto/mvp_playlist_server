INSERT INTO songs (title, artist, video_link, user_id, domain) VALUES ('title 1', 'artist 1', 'adfasfw', 1, 'youtube');
INSERT INTO songs (title, artist, video_link, user_id, domain) VALUES ('title 2', 'artist 2', 'addsffasfw', 1, 'unknown');
INSERT INTO songs (title, artist, video_link, user_id, domain) VALUES ('title 3', 'artist 3', 'adsdwfasfw', 2, 'youtube');
INSERT INTO songs (title, artist, video_link, user_id, domain) VALUES ('title 4', 'artist 4', 'addsfsdwfasfw', 2, 'unknown');

INSERT INTO playlists (user_id, name) VALUES (1, 'playlist 1');
INSERT INTO playlists (user_id, name) VALUES (2, 'playlist 2');
INSERT INTO playlists (user_id, name) VALUES (1, 'playlist 3');
INSERT INTO playlists (user_id, name) VALUES (2, 'playlist 4');

INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (1, 1, 1);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (2, 1, 1);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (3, 2, 2);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (4, 2, 2);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (1, 3, 1);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (2, 3, 1);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (3, 4, 2);
INSERT INTO playlist_songs (song_id, playlist_id, user_id) VALUES (4, 4, 2);
