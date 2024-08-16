package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Your MongoDB Atlas Connection String
var mongoURI = os.Getenv("MONGO_URI")

// A global variable that will hold a reference to the MongoDB client
var mongoClient *mongo.Client

var collection *mongo.Collection

func init() {
    if err := connect_to_mongodb(); err != nil {
        log.Fatal("Could not connect to MongoDB")
    }
}

func main() {
    // serverAPI := options.ServerAPI(options.ServerAPIVersion1)
    // opts := options.Client().ApplyURI("mongodb+srv://rudypenajr:<password>@cluster0.6ay7bhy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").SetServerAPIOptions(serverAPI)

	// mongoURI := os.Getenv("MONGO_URI")
    // Set up MongoDB connection
    // client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
    // if err != nil {
    //     log.Fatal(err)
    // }
    // ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    // defer cancel()
    // err = client.Connect(ctx)
    // if err != nil {
    //     log.Fatal(err)
    // }
    // defer client.Disconnect(ctx)

    // var dbName = os.Getenv("MONGO_DB_NAME")
    // var collectionName = os.Getenv("MONGO_COLLECTION")
    // collection = mongoClient.Database(dbName).Collection(collectionName)

    // Set up Gin
    r := gin.Default()

    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Hello World",
        })
    })


    // Define endpoints
    r.GET("/episodes", getEpisodes)

    // Start server
    r.Run(":8080")
}

// Our implementation logic for connecting to MongoDB
func connect_to_mongodb() error {
    serverAPI := options.ServerAPI(options.ServerAPIVersion1)
    opts := options.Client().ApplyURI(mongoURI).SetServerAPIOptions(serverAPI)

    client, err := mongo.Connect(context.TODO(), opts)
    if err != nil {
        panic(err)
    }
    err = client.Ping(context.TODO(), nil)
    mongoClient = client
    return err
}

func getEpisodes(c *gin.Context) {
    var dbName = os.Getenv("MONGO_DB_NAME")
    var collectionName = os.Getenv("MONGO_COLLECTION")
    collection = mongoClient.Database(dbName).Collection(collectionName)

    // Find Episodes
    cursor, err := mongoClient.Database(dbName).Collection(collectionName).Find(context.TODO(), bson.D{{}})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Map results
    var episodes []bson.M
    if err = cursor.All(context.TODO(), &episodes); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Return Episodes
    c.JSON(http.StatusOK, episodes)
}
