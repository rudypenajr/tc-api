package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rudypenajr/tc-api/modules/chat"
	"github.com/sashabaranov/go-openai"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Global MongoDB & OpenAI clients
var client *mongo.Client
var collection *mongo.Collection
var openaiClient *openai.Client
// Your MongoDB Atlas Connection String
var mongoURI = os.Getenv("MONGO_URI")
// A global variable that will hold a reference to the MongoDB client
var mongoClient *mongo.Client


func init() {
    if err := connect_to_mongodb(); err != nil {
        log.Fatal("Could not connect to MongoDB")
    }
}

func main() {
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
    

    // Initialize Chat Service
    chatService := chat.NewChatService(collection, openaiClient)
    r.POST("/ask", chatService.HandleAsk) // Register chat module handler

    // Start server
    r.Run(":8080")
}

// Our implementation logic for connecting to MongoDB
func connect_to_mongodb() error {
    serverAPI := options.ServerAPI(options.ServerAPIVersion1)
    fmt.Println("Mongo URI: ", mongoURI)
    
    opts := options.Client().ApplyURI(mongoURI).SetServerAPIOptions(serverAPI)
    fmt.Println("Mongo OPTS: ", opts)
    
    client, err := mongo.Connect(context.TODO(), opts)
    if err != nil {
        panic(err)
    }
    err = client.Ping(context.TODO(), nil)
    fmt.Print("error is on client.PING")
    
    mongoClient = client
    if err != nil {
        return err
    }
    
    // Set Context for Collection
    var dbName = os.Getenv("MONGO_DB_NAME")
    var collectionName = os.Getenv("MONGO_COLLECTION")
    collection = mongoClient.Database(dbName).Collection(collectionName)
    fmt.Print("collection", collection)
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
    // Relies on Atlas Search
    // pipeline := mongo.Pipeline{
    //     {{"$search", bson.D{
    //         {"index", "default"},
    //         {"compound", bson.D{
    //             {"should", bson.A{
    //                 bson.D{
    //                     {"text", bson.D{
    //                         {"query", query},
    //                         {"path", bson.M{"wildcard": "*"}},
    //                     }},
    //                 },
    //             }},
    //             {"sort", bson.A{
    //                 bson.D{
    //                     {"Timestamp", 1}, // 1 for ascending, -1 for descending
    //                 },
    //             }},
    //         }},
    //     }}},
    //     {{"$skip", skip}},
    //     {{"$limit", limit}},
    // }

    pipeline := mongo.Pipeline{
    // Search Stage
    {{"$search", bson.D{
        {"index", "default"},
        {"text", bson.D{
            {"query", query},
            {"path", bson.M{"wildcard": "*"}},
        }},
    }}},

    // Sorting Stage NOT WORKING
    {{"$sort", bson.D{{"Timestamp", -1}}}}, // 1 for ascending, -1 for descending

    // Pagination Stage
    {{"$skip", skip}},
    {{"$limit", limit}},
}


    // pipeline := mongo.Pipeline{
    //     {{"$search", bson.D{
    //         {"index", "default"},
    //         {"text", bson.D{
    //             {"query", query},
    //             {"path", bson.M{"wildcard": "*"}},
    //         }},
    //     }}},
    //     {{"$skip", skip}},
    //     {{"$limit", limit}},
    // }

    // fmt.Print(filter)
    // fmt.Print("############")
    // fmt.Print(pipeline)

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