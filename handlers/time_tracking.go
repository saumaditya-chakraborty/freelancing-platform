package handlers

import (
	"time"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// ======================================================
// Helper
// ======================================================

func getFreelancerID(c *fiber.Ctx) uint {
	return c.Locals("userID").(uint)
}

// ======================================================
// START TIMER
// POST /projects/:id/time/start
// ======================================================

func StartTimer(c *fiber.Ctx) error {

	projectID, err := c.ParamsInt("id")
	if err != nil || projectID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	freelancerID := getFreelancerID(c)

	// Verify project exists
	var project models.Project
	if err := config.DB.First(&project, projectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	tx := config.DB.Begin()

	var tracking models.TimeTracking

	err = tx.
		Where("project_id = ? AND freelancer_id = ?", projectID, freelancerID).
		First(&tracking).Error

	if err == gorm.ErrRecordNotFound {

		tracking = models.TimeTracking{
			ProjectID:    uint(projectID),
			FreelancerID: freelancerID,
			Status:       "running",
			TotalSeconds: 0,
		}

		if err := tx.Create(&tracking).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

	} else if err != nil {

		tx.Rollback()

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})

	} else {

		switch tracking.Status {

		case "running":
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Timer already running",
			})

		case "completed":
			tx.Rollback()
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Timer already completed",
			})
		}

		tracking.Status = "running"

		if err := tx.Save(&tracking).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	}

	log := models.TimeLog{
		TimeTrackingID: tracking.ID,
		StartTime:      time.Now(),
	}

	if err := tx.Create(&log).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message":  "Timer started successfully",
		"tracking": tracking,
	})
}

// ======================================================
// PAUSE TIMER
// PATCH /time/:id/pause
// ======================================================

func PauseTimer(c *fiber.Ctx) error {

	trackingID, err := c.ParamsInt("id")
	if err != nil || trackingID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid tracking ID",
		})
	}

	var tracking models.TimeTracking

	if err := config.DB.First(&tracking, trackingID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Tracking not found",
		})
	}

	if tracking.Status != "running" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Timer is not running",
		})
	}

	tx := config.DB.Begin()

	var log models.TimeLog

	if err := tx.
		Where("time_tracking_id = ? AND end_time = ?", tracking.ID, time.Time{}).
		Order("id DESC").
		First(&log).Error; err != nil {

		tx.Rollback()

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No active session found",
		})
	}

	now := time.Now()

	duration := int(now.Sub(log.StartTime).Seconds())

	log.EndTime = now
	log.DurationSeconds = duration

	if err := tx.Save(&log).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tracking.TotalSeconds += duration
	tracking.Status = "paused"

	if err := tx.Save(&tracking).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message":       "Timer paused successfully",
		"workedSeconds": duration,
		"totalSeconds":  tracking.TotalSeconds,
		"tracking":      tracking,
	})
}
// ======================================================
// RESUME TIMER
// PATCH /time/:id/resume
// ======================================================

func ResumeTimer(c *fiber.Ctx) error {

	trackingID, err := c.ParamsInt("id")
	if err != nil || trackingID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid tracking ID",
		})
	}

	var tracking models.TimeTracking

	if err := config.DB.First(&tracking, trackingID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Tracking not found",
		})
	}

	if tracking.Status != "paused" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Timer is not paused",
		})
	}

	tx := config.DB.Begin()

	tracking.Status = "running"

	if err := tx.Save(&tracking).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	log := models.TimeLog{
		TimeTrackingID: tracking.ID,
		StartTime:      time.Now(),
	}

	if err := tx.Create(&log).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message":  "Timer resumed successfully",
		"tracking": tracking,
	})
}

// ======================================================
// STOP TIMER
// PATCH /time/:id/stop
// ======================================================

func StopTimer(c *fiber.Ctx) error {

	trackingID, err := c.ParamsInt("id")
	if err != nil || trackingID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid tracking ID",
		})
	}

	var tracking models.TimeTracking

	if err := config.DB.First(&tracking, trackingID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Tracking not found",
		})
	}

	if tracking.Status == "completed" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Timer already completed",
		})
	}

	tx := config.DB.Begin()

	if tracking.Status == "running" {

		var log models.TimeLog

		err := tx.
			Where("time_tracking_id = ? AND end_time = ?", tracking.ID, time.Time{}).
			Order("id DESC").
			First(&log).Error

		if err == nil {

			now := time.Now()

			duration := int(now.Sub(log.StartTime).Seconds())

			log.EndTime = now
			log.DurationSeconds = duration

			if err := tx.Save(&log).Error; err != nil {
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": err.Error(),
				})
			}

			tracking.TotalSeconds += duration
		}
	}

	tracking.Status = "completed"

	if err := tx.Save(&tracking).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message":      "Timer stopped successfully",
		"totalSeconds": tracking.TotalSeconds,
		"tracking":     tracking,
	})
}

// ======================================================
// GET PROJECT TIME
// GET /projects/:id/time
// ======================================================

func GetProjectTime(c *fiber.Ctx) error {

	projectID, err := c.ParamsInt("id")
	if err != nil || projectID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	freelancerID := getFreelancerID(c)

	var tracking models.TimeTracking

	err = config.DB.
		Where("project_id = ? AND freelancer_id = ?", projectID, freelancerID).
		First(&tracking).Error

	if err == gorm.ErrRecordNotFound {

		return c.JSON(fiber.Map{
			"tracking": nil,
		})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"tracking": tracking,
	})
}

// ======================================================
// GET TIME LOGS
// GET /projects/:id/time/logs
// ======================================================

func GetTimeLogs(c *fiber.Ctx) error {

	projectID, err := c.ParamsInt("id")
	if err != nil || projectID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID",
		})
	}

	freelancerID := getFreelancerID(c)

	var tracking models.TimeTracking

	err = config.DB.
		Where("project_id = ? AND freelancer_id = ?", projectID, freelancerID).
		First(&tracking).Error

	if err == gorm.ErrRecordNotFound {

		return c.JSON(fiber.Map{
			"tracking": nil,
			"logs":     []models.TimeLog{},
		})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var logs []models.TimeLog

	if err := config.DB.
		Where("time_tracking_id = ?", tracking.ID).
		Order("start_time ASC").
		Find(&logs).Error; err != nil {

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"tracking": tracking,
		"logs":     logs,
	})
}