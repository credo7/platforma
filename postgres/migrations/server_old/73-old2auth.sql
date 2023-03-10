TRUNCATE auth.users CASCADE;

INSERT INTO auth.users (
        "id", "email", "password", "username", "createdAt"
    ) 
    SELECT 
        "id", "email", "password", "username", "createdAt" 
    FROM old.users;

UPDATE auth.users SET "role" = 'ADMIN', "emailVerified" = true 
    WHERE username = 'admin';

