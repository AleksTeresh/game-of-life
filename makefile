.PHONY=start-backend
start-backend:
	cd backend && npm start

.PHONY=start-frontend
start-frontend:
	cd web && npm start

.PHONY=start-local-db
start-local-db:
	docker run --name game-of-life-db -p 5432:5432 -e POSTGRES_USER=me -e POSTGRES_PASSWORD=password -e POSTGRES_DB=game-of-life -d postgres

.PHONY=stop-local-db
stop-local-db:
	docker rm -f game-of-life-db