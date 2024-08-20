package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"

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
    r.GET("/episodes", getEpisodesHandler)
    r.GET("/search", searchHandler)
    // http.HandleFunc("/search", searchHandler)

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
    if err != nil {
        return err
    }
    
    // Set Context for Collection
    var dbName = os.Getenv("MONGO_DB_NAME")
    var collectionName = os.Getenv("MONGO_COLLECTION")
    collection = mongoClient.Database(dbName).Collection(collectionName)

    return err;
}

func getEpisodesHandler(c *gin.Context) {
    // Find Episodes
    cursor, err := collection.Find(context.TODO(), bson.D{{}})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Map results
    var episodes []bson.M
    if err := cursor.All(context.TODO(), &episodes); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Return Episodes
    // c.JSON(http.StatusOK, episodes)
    c.JSON(http.StatusOK, gin.H{
        "results": episodes,
        "count": len(episodes),
    })
}

// func searchHandler(w http.ResponseWriter, r *http.Request) {
func searchHandler(c *gin.Context) {
    query := c.Query("q")
    if query == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
        return
    }

    // Get pagination parameters
    limitStr := c.Query("limit")
    pageStr := c.Query("page")

    limit, err := strconv.ParseInt(limitStr, 10, 64)
    if err != nil || limit <= 0 {
        limit = 10 // default limit
    }

    page, err := strconv.ParseInt(pageStr, 10, 64)
    if err != nil || page <= 0 {
        page = 1 // default page
    }

    skip := (page - 1) * limit

    // filter := bson.M{
    //     "$text": bson.M{"$search": query},
    // }

      // Construct the aggregation pipeline with pagination
    pipeline := mongo.Pipeline{
        {{"$search", bson.D{
            {"index", "default"},
            {"text", bson.D{
                {"query", query},
                {"path", bson.M{"wildcard": "*"}},
            }},
        }}},
        {{"$skip", skip}},
        {{"$limit", limit}},
    }

    // findOptions := options.Find()
    // if limit > 0 {
    //     findOptions.SetLimit(limit)
    // }
    // if skip > 0 {
    //     findOptions.SetSkip(skip)
    // }

    // cursor, err := collection.Find(context.TODO(), filter, findOptions)
    // if err != nil {
    //     c.JSON(http.StatusInternalServerError, gin.H{"error": "Error searching in the database"})
    //     return
    // }

    cursor, err := collection.Aggregate(context.TODO(), pipeline)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error searching in the database"})
        return
    }
    defer cursor.Close(context.TODO())

    var results []bson.M
    if err = cursor.All(context.TODO(), &results); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding results"})
        return
    }

    if len(results) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"message": "No results found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "results": results,
        "page":    page,
        "limit":   limit,
    })
}