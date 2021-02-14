-- CreateTable
CREATE TABLE "Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workoutType" TEXT NOT NULL,
    "duration" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "sets" INTEGER,
    "repsPerSet" INTEGER,
    "workoutId" INTEGER NOT NULL,
    "distance" DECIMAL,
    FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE
);
