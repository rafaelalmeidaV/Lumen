package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterLivenessReadinessRoutes(r *gin.Engine) {
	routes := r.Group("/liveness-readiness")
	{
		routes.GET("", LivenessReadinessHandler)
	}
}

func LivenessReadinessHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "UP",
		"message": "I'm alive",
	})
}
