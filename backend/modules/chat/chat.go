package chat

import (
	"context"
	"fmt"
	"net/http"

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
	return &ChatService{
		Collection:   collection,
		OpenAIClient: openAIClient,
	}
}

// HandleAsk processes user queries and generates an AI response
func (s *ChatService) HandleAsk(c *gin.Context) {
	var request struct {
		Query string `json:"query"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Generate embeddings for the query
	queryVector, err := generateEmbedding(s.OpenAIClient, request.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate embedding"})
		return
	}

	// Perform vector search to retrieve relevant episodes
	episodes, err := searchMongoDB(s.Collection, queryVector)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve context"})
		return
	}

	// Convert episode data into context string for the AI
	episodeText := formatEpisodes(episodes)

	// Generate AI response using OpenAI
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

	c.JSON(http.StatusOK, ChatResponse{Response: resp.Choices[0].Message.Content})
}

// Generates embeddings for a query
func generateEmbedding(client *openai.Client, text string) ([]float32, error) {
	resp, err := client.CreateEmbeddings(context.TODO(), openai.EmbeddingRequest{
		Model: openai.AdaEmbeddingV2,
		Input: []string{text},
	})
	if err != nil {
		return nil, err
	}
	return resp.Data[0].Embedding, nil
}

// Searches MongoDB using vector search
func searchMongoDB(collection *mongo.Collection, queryVector []float32) ([]bson.M, error) {
	var episodes []bson.M

	cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{
		{{"$vectorSearch", bson.M{
			"queryVector": queryVector,
			"path":        "embedding",
			"numCandidates": 10,
			"limit":        5,
			"index":        "vectorIndex",
		}}},
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	if err := cursor.All(context.TODO(), &episodes); err != nil {
		return nil, err
	}

	return episodes, nil
}

// Formats episodes into readable text for AI
func formatEpisodes(episodes []bson.M) string {
	var result string
	for _, e := range episodes {
		result += fmt.Sprintf("Title: %s, Guests: %v, Year: %s\n", e["title"], e["guests"], e["top_5_comparison_year"])
	}
	return result
}
