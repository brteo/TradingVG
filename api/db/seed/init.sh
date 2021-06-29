#!/bin/bash

# Import dei tag
mongoimport -u $MONGO_DATABASE_USERNAME -p $MONGO_DATABASE_PASSWORD --collection tags --db $MONGO_INITDB_DATABASE /seed/tags.json --jsonArray

# Import delle categorie
mongoimport -u $MONGO_DATABASE_USERNAME -p $MONGO_DATABASE_PASSWORD --collection categories --db $MONGO_INITDB_DATABASE /seed/categories.json --jsonArray
