import { ChangeEvent, useState } from "react";

interface UseFormReturnInterface<T> {
  handleChange(e: ChangeEvent<HTMLInputElement>): void;
  inputs: T;
}

function useForm<T>(initialState: T): UseFormReturnInterface<T> {
  const [inputs, setState] = useState(initialState);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...inputs, [e.target.name]: e.target.value });
  }

  return { handleChange, inputs };
}

export default useForm;
