**CREATE POSTGRES DATABASE**

**in terminal run following command:**
1. `docker run --name real-time-db -e POSTGRES_PASSWORD=Password -p 5432:5432 -d postgres`
2. `docker exec -it real-time-db psql -U postgres`
3. `CREATE DATABASE "real-time-db";`
4. `CREATE USER admin WITH PASSWORD 'Password';`
5. `ALTER USER admin SUPERUSER;`



**MIGRATE DATABASE WITH PRISMA**

**in terminal run following command:**
- change modal in *prisma.schema*
- run `npx prisma migrate dev --name [name is migrate]`


**CREATE REDIS**

**in terminal run following command:**

`docker run -p 6379:6379 -d redis`


