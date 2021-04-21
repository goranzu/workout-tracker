export type AuthResponse = {
    userInfo: {
        username: string;
        id: string;
    }
};

export type AuthAxiosResponse = {
  data: AuthResponse;
};

export interface Exercise {
    name: string;
    sets?: number;
    repsPerSet?: number;
    distance?: number;
    weightLifted?: number;
  }

  export interface Workout {
    exercises?: Exercise[];
    workoutType: "cardio" | "lifting";
    duration?: number;
    userInputDate: string;
  }
