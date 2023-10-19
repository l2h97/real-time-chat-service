# REAL TIME CHAT APP

**CREATE POSTGRES DATABASE**

**in terminal run following command:**
1. `docker run --name real-time-db -e POSTGRES_PASSWORD=Password -p 5432:5432 -d postgres`
2. `docker exec -it real-time-db psql -U postgres`
3. `CREATE DATABASE "real-time-db";`
4. `CREATE USER admin WITH PASSWORD 'Password';`
5. `ALTER USER admin SUPERUSER;`
6. `CREATE DATABASE "real-time-db-test";`

**MIGRATE DATABASE WITH PRISMA**

**in terminal run following command:**
1. Make a schema change that requires custom SQL (for example, to preserve existing data)
2. Create a draft migration using:
`npx prisma migrate dev --create-only`
3. Modify the generated SQL file.
4. Apply the modified SQL by running:
`npx prisma migrate dev`

**CREATE REDIS**

**in terminal run following command:**

`docker run --name real-time-redis -d -p 6379:6379 redis`

**CREATE ELASTIC SEARCH**\
read the [link](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)

**CREATE MONGODB**

**in terminal run following command:**



