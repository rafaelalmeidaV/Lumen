package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterUsersRoutes(r *gin.Engine) {
	routes := r.Group("/users")
	{
		routes.POST("/create", CreateUserHandler)
		routes.POST("/login", CreateUserHandler)
	}
}

func CreateUserHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Not implemented",
	})
}

func LoginHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Not implemented",
	})
}

