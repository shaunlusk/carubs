CREATE TABLE Comments (
    id              TEXT        NOT NULL, 
    user_id         TEXT        NOT NULL,
    timestamp       INTEGER     NOT NULL,
    body            TEXT        NOT NULL,
    up              INTEGER     NOT NULL,
    down            INTEGER     NOT NULL,
    subreddit_id    TEXT        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (subreddit_id) REFERENCES Subreddits(id)   
);

