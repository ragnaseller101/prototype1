if [ "$status" -eq 429 ]
then
		kill 1
		node index.js
fi