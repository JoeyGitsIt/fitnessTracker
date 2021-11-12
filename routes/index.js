const path = require("path");
const router = require("express").Router();
const Workout = require("../models/Workout.js");

// route for the exercise page that is in starter code
router.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/exercise.html"));
});

// route for the stats page that is in starter code
router.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/stats.html"));
});

// route to get workouts
router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .then((workoutDb) => {
      res.json(workoutDb);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// route to get the last workout
router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: "$exercises.duration",
        },
      },
    },
  ])
    .sort({ day: -1 })
    .limit(7)
    .then((workoutDb) => {
      res.json(workoutDb);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// route to change/add to the specified workout
router.put("/api/workouts/:id", (req, res) => {
  Workout.updateOne(
    {
      _id: req.params.id,
    },
    {
      $push: {
        exercises: req.body,
      },
    }
  )
    .then((workoutDb) => {
      res.json(workoutDb);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// route to create a workout
router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then((workoutDb) => {
      res.json(workoutDb);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
