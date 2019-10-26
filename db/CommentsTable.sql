CREATE TABLE Comments (
    id              TEXT        NOT NULL, 
    user_id         TEXT        NOT NULL,
    created_utc       INTEGER     NOT NULL,
    body            TEXT        NOT NULL,
    ups              INTEGER     NOT NULL,
    downs            INTEGER     NOT NULL,
    subreddit_id    TEXT        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (subreddit_id) REFERENCES Subreddits(id)   
);

