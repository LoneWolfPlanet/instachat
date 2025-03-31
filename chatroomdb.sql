CREATE TABLE "user" (
  userid SERIAL PRIMARY KEY,
  type INT DEFAULT 2,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  password VARCHAR(255) NOT NULL UNIQUE,
  status INT DEFAULT 1
);

CREATE UNIQUE INDEX idx_user_userid ON "user"(userid);
CREATE INDEX idx_username ON "user"(username);
CREATE INDEX idx_email ON "user"(email);


CREATE TABLE room (
 roomid serial primary key,
 description varchar(255) not null UNIQUE,
 passpharse UUID DEFAULT gen_random_uuid(),
 status integer default 1,
 createddate timestamp not null default current_timestamp,
 createdby integer,
    CONSTRAINT fk_createdby FOREIGN KEY (createdby)
        REFERENCES public."user" (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION

);

CREATE UNIQUE INDEX idx_room_roomid ON room(roomid);


CREATE TABLE message (
 messageid SERIAL PRIMARY KEY,
 roomid INTEGER NOT NULL,
 phrase text,
 createddate timestamp default current_timestamp,
 chatbyname VARCHAR(255) NULL,
 usertype INT DEFAULT 2,
 chatbyid INTEGER NULL,
    CONSTRAINT fk_room FOREIGN KEY (roomid)
        REFERENCES public.room (roomid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
CREATE UNIQUE INDEX idx_message_messageid ON message(messageid);


CREATE TABLE userroom(
 userroomid serial primary key,
 roomid integer not null,
 userid integer not null,
 joindate timestamp default current_timestamp,
    CONSTRAINT fk_room FOREIGN KEY (roomid)
        REFERENCES public.room (roomid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_user FOREIGN KEY (userid)
        REFERENCES public."user" (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
	
);

CREATE UNIQUE INDEX idx_userroom_useroomid ON userroom(userroomid);

