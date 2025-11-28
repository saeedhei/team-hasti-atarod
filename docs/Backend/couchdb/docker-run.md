docker run -d \
 --name my-couchdb \
 -p 5984:5984 \
 -e COUCHDB_USER=admin \
 -e COUCHDB_PASSWORD=securepassword123 \
 couchdb:3.4.2

docker rm my-couchdb
