.PHONY=start-backend
start-backend:
	cd backend && npm start

.PHONY=start-frontend
start-frontend:
	cd web && npm start

.PHONY=start-local-db
start-local-db:
	docker run --name game-of-life-db -p 5432:5432 -e POSTGRES_USER=me -e POSTGRES_PASSWORD=password -e POSTGRES_DB=game-of-life -d postgres
	docker cp ./backend/setup.sql game-of-life-db:/tmp/file.sql
	sleep 5
	docker exec game-of-life-db psql game-of-life me -f /tmp/file.sql

.PHONY=stop-local-db
stop-local-db:
	docker rm -f game-of-life-db