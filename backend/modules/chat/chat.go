package chat

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ChatResponse represents the chatbot response format
type ChatResponse struct {
	Response string `json:"response"`
}

// ChatService struct to handle chat operations
type ChatService struct {
	Collection   *mongo.Collection
	OpenAIClient *openai.Client
}

// NewChatService creates a new chat service instance
func NewChatService(collection *mongo.Collection, openAIClient *openai.Client) *ChatService {
	if openAIClient == nil {
		log.Fatal("❌ OpenAI client is nil in ChatService")
	}
	return &ChatService{
		Collection:   collection,
		OpenAIClient: openAIClient,
	}
}

// 🔹 Handle AI Chat Queries
func (s *ChatService) HandleAsk(c *gin.Context) {
	var request struct {
		Query string `json:"query"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Generate embeddings for the query
	queryVector, err := s.GenerateEmbedding(request.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate embedding"})
		return
	}

	// Retrieve relevant episodes
	episodes, err := s.SearchMongoDB(queryVector)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve context"})
		return
	}

	// Debug log: Print retrieved episodes
	if len(episodes) == 0 {
		log.Println("❌ No relevant episodes found. AI has no context.")
	} else {
		log.Printf("✅ Sending %d episodes to OpenAI for context.\n", len(episodes))
	}

	// Format episodes for OpenAI
	// episodeText := formatEpisodes(episodes)
	// 🔹 Use `formatted_date` before sending to AI
	episodeText := formatEpisodesForAI(episodes)

	// Send formatted context to OpenAI
	resp, err := s.OpenAIClient.CreateChatCompletion(context.TODO(), openai.ChatCompletionRequest{
		Model: openai.GPT3Dot5Turbo,
		Messages: []openai.ChatCompletionMessage{
			{Role: "system", Content: "You are an assistant that helps users find episode details."},
			{Role: "user", Content: fmt.Sprintf("Based on these episodes:\n%s\n Answer this: %s", episodeText, request.Query)},
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate response"})
		return
	}

	// Debug log: Print OpenAI response
	log.Printf("✅ AI Response: %s\n", resp.Choices[0].Message.Content)

	c.JSON(http.StatusOK, ChatResponse{Response: resp.Choices[0].Message.Content})
}

// 🔹 Generate Embeddings for a Query (Vector Representation)
func (s *ChatService) GenerateEmbedding(text string) ([]float32, error) {
	resp, err := s.OpenAIClient.CreateEmbeddings(context.TODO(), openai.EmbeddingRequest{
		Model: openai.AdaEmbeddingV2,
		Input: []string{text},
	})
	if err != nil {
		return nil, err
	}

	// Debug: Print the first 5 values
	log.Println("🔹 Generated Query Embedding:", resp.Data[0].Embedding[:5])
	
	return resp.Data[0].Embedding, nil
}

// 🔹 Perform Vector Search in MongoDB
func (s *ChatService) SearchMongoDB(queryVector []float32) ([]bson.M, error) {
	var episodes []bson.M

	cursor, err := s.Collection.Aggregate(context.TODO(), mongo.Pipeline{
		{{"$vectorSearch", bson.M{
			"queryVector": queryVector,
			"path":        "embedding",
			"numCandidates": 10,
			"limit":        5,
			"index":        "vector_index", // Ensure this matches your MongoDB Atlas vector index name
		}}},
	})
	if err != nil {
		log.Println("❌ MongoDB Vector Search Error:", err)
		return nil, err
	}
	defer cursor.Close(context.TODO())

	if err := cursor.All(context.TODO(), &episodes); err != nil {
		log.Println("❌ Error decoding MongoDB results:", err)
		return nil, err
	}

	// 🔹 Ensure `formatted_date` is included
	for i := range episodes {
		if date, ok := episodes[i]["date"].(string); ok {
			formattedDate, err := convertDateToISO(date)
			if err == nil {
				episodes[i]["formatted_date"] = formattedDate
			} else {
				episodes[i]["formatted_date"] = date // Fallback
			}
		}
	}

	log.Printf("✅ Found %d episodes from MongoDB (Vector Search)\n", len(episodes))
	return episodes, nil
}

// 🔹 Formats episodes into readable text for AI
func formatEpisodes(episodes []bson.M) string {
	var result string
	for _, e := range episodes {
		result += fmt.Sprintf("Title: %s, Guests: %v, Year: %s\n", e["title"], e["guests"], e["top_5_comparison_year"])
	}
	return result
}

// 🔹 Converts "November 15, 2015" → "2015-11-15"
func convertDateToISO(dateStr string) (string, error) {
	// Parse date using "January 2, 2006" format (Go's reference layout)
	t, err := time.Parse("January 2, 2006", dateStr)
	if err != nil {
		return "", err // Return empty if parsing fails
	}
	// Convert to ISO 8601 format "YYYY-MM-DD"
	return t.Format("2006-01-02"), nil
}

func formatEpisodesForAI(episodes []bson.M) string {
	var result string
	for _, e := range episodes {
		dateStr := ""

		// 🔹 Use `formatted_date` if available, otherwise use `date`
		if formattedDate, ok := e["formatted_date"].(string); ok {
			dateStr = formattedDate
		} else if originalDate, ok := e["date"].(string); ok {
			// Convert date format if necessary
			convertedDate, err := convertDateToISO(originalDate)
			if err == nil {
				dateStr = convertedDate
			} else {
				dateStr = originalDate // Fallback to original
			}
		}

		result += fmt.Sprintf("Title: %s, Guests: %v, Year: %s\n", e["title"], e["guests"], dateStr)
	}
	return result
}



// package chat

// import (
// 	"context"
// 	"fmt"
// 	"log"
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// 	"github.com/sashabaranov/go-openai"
// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/mongo"
// )

// // ChatResponse represents the chatbot response format
// type ChatResponse struct {
// 	Response string `json:"response"`
// }

// // ChatService struct to handle chat operations
// type ChatService struct {
// 	Collection   *mongo.Collection
// 	OpenAIClient *openai.Client
// }

// // NewChatService creates a new chat service instance
// func NewChatService(collection *mongo.Collection, openAIClient *openai.Client) *ChatService {
// 	if openAIClient == nil {
// 		log.Fatal("❌ OpenAI client is nil in ChatService")
// 	}
// 	return &ChatService{
// 		Collection:   collection,
// 		OpenAIClient: openAIClient,
// 	}
// }

// // HandleAsk processes user queries and generates an AI response
// func (s *ChatService) HandleAsk(c *gin.Context) {
// 	var request struct {
// 		Query string `json:"query"`
// 	}
// 	if err := c.ShouldBindJSON(&request); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
// 		return
// 	}

// 	// Generate embeddings for the query
// 	queryVector, err := generateEmbedding(s.OpenAIClient, request.Query)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate embedding"})
// 		return
// 	}

// 	// Retrieve relevant episodes
// 	episodes, err := searchMongoDB(s.Collection, queryVector)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve context"})
// 		return
// 	}

// 	// Debug log: Print retrieved episodes
// 	if len(episodes) == 0 {
// 		log.Println("❌ No relevant episodes found. AI has no context.")
// 	} else {
// 		log.Printf("✅ Sending %d episodes to OpenAI for context.\n", len(episodes))
// 	}

// 	// Format episodes for OpenAI
// 	episodeText := formatEpisodes(episodes)

// 	// Send formatted context to OpenAI
// 	resp, err := s.OpenAIClient.CreateChatCompletion(context.TODO(), openai.ChatCompletionRequest{
// 		Model: openai.GPT3Dot5Turbo,
// 		Messages: []openai.ChatCompletionMessage{
// 			{Role: "system", Content: "You are an assistant that helps users find episode details."},
// 			{Role: "user", Content: fmt.Sprintf("Based on these episodes:\n%s\n Answer this: %s", episodeText, request.Query)},
// 		},
// 	})
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate response"})
// 		return
// 	}

// 	// Debug log: Print OpenAI response
// 	log.Printf("✅ AI Response: %s\n", resp.Choices[0].Message.Content)

// 	c.JSON(http.StatusOK, ChatResponse{Response: resp.Choices[0].Message.Content})
// }


// // Generates embeddings for a query
// // func generateEmbedding(client *openai.Client, text string) ([]float32, error) {
// // 	resp, err := client.CreateEmbeddings(context.TODO(), openai.EmbeddingRequest{
// // 		Model: openai.AdaEmbeddingV2,
// // 		Input: []string{text},
// // 	})
// // 	if err != nil {
// // 		return nil, err
// // 	}
// // 	return resp.Data[0].Embedding, nil
// // }

// // Generate Embeddings for a Query
// func (s *ChatService) GenerateEmbedding(text string) ([]float32, error) {
// 	resp, err := s.OpenAIClient.CreateEmbeddings(context.TODO(), openai.EmbeddingRequest{
// 		Model: openai.AdaEmbeddingV2,
// 		Input: []string{text},
// 	})
// 	if err != nil {
// 		return nil, err
// 	}
// 	return resp.Data[0].Embedding, nil
// }

// // Searches MongoDB using vector search
// // func searchMongoDB(collection *mongo.Collection, queryVector []float32) ([]bson.M, error) {
// // 	var episodes []bson.M

// // 	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{
// // 		{{"$vectorSearch", bson.M{
// // 			"queryVector": queryVector,
// // 			"path":        "embedding",
// // 			"numCandidates": 10,
// // 			"limit":        5,
// // 			"index":        "vector_index",
// // 		}}},
// // 	})
// // 	if err != nil {
// // 		log.Println("❌ MongoDB Vector Search Error:", err)
// // 		return nil, err
// // 	}
// // 	defer cursor.Close(context.TODO())

// // 	if err := cursor.All(context.TODO(), &episodes); err != nil {
// // 		log.Println("❌ Error decoding MongoDB results:", err)
// // 		return nil, err
// // 	}

// // 	// Debug log: Print found episodes
// // 	log.Printf("✅ Found %d episodes from MongoDB\n", len(episodes))

// // 	return episodes, nil
// // }

// // Perform Vector Search in MongoDB
// func (s *ChatService) SearchMongoDB(queryVector []float32) ([]bson.M, error) {
// 	var episodes []bson.M

// 	cursor, err := s.Collection.Aggregate(context.TODO(), mongo.Pipeline{
// 		{{"$vectorSearch", bson.M{
// 			"queryVector": queryVector,
// 			"path":        "embedding",
// 			"numCandidates": 10,
// 			"limit":        5,
// 			"index":        "vectorIndex",
// 		}}},
// 	})
// 	if err != nil {
// 		log.Println("❌ MongoDB Vector Search Error:", err)
// 		return nil, err
// 	}
// 	defer cursor.Close(context.TODO())

// 	if err := cursor.All(context.TODO(), &episodes); err != nil {
// 		log.Println("❌ Error decoding MongoDB results:", err)
// 		return nil, err
// 	}

// 	log.Printf("✅ Found %d episodes from MongoDB (Vector Search)\n", len(episodes))
// 	return episodes, nil
// }

// // Formats episodes into readable text for AI
// func formatEpisodes(episodes []bson.M) string {
// 	var result string
// 	for _, e := range episodes {
// 		result += fmt.Sprintf("Title: %s, Guests: %v, Year: %s\n", e["title"], e["guests"], e["top_5_comparison_year"])
// 	}
// 	return result
// }
