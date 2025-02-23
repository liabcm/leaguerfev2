run-api:
	cd leaguerAPI && dotnet run --project ./leaguerAPI.csproj
run-client:
	cd web && npm i && npm run dev
run-app:
	make run-api & make run-client