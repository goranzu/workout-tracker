import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { endpoint } from "../config";
import { useAxios } from "../context/AxiosContext";

interface WorkoutInteface {
  id: string;
  workoutType: string;
  duration: number;
  date: string;
  exercises: {
    id: string;
    name: string;
    distance?: number;
    sets?: number;
    repsPerSet?: number;
    weightsLifted?: number;
  }[];
}

interface WorkoutResponseInterface {
  data: WorkoutInteface;
}

interface ErrorResponseInterface {
  error: {
    message: string;
    stack?: string;
    path: string;
  };
}

const URL = endpoint + "/api/workout";

export function useGetAllWorkouts() {
  const { appAxios } = useAxios();
  return useQuery<
    AxiosResponse<{ data: WorkoutInteface[] }>,
    AxiosError<ErrorResponseInterface>
  >("allWorkouts", () => appAxios.get(URL));
}

export function useCreateWorkout() {
  const { appAxios } = useAxios();
  return useMutation<
    AxiosResponse<WorkoutResponseInterface>,
    AxiosError<ErrorResponseInterface>,
    any
  >((inputs) => appAxios.post(URL, inputs));
}
