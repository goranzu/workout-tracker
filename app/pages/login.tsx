import useForm from "../hooks/useForm";

interface LoginFormValues {
  username: string;
  password: string;
}

function LoginPage(): JSX.Element {
  const { inputs, handleChange } = useForm<LoginFormValues>({
    password: "",
    username: "",
  });

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(inputs);
        }}
      >
        <fieldset>
          <label htmlFor="username">
            Username
            <input
              onChange={handleChange}
              value={inputs.username}
              type="text"
              name="username"
              id="username"
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              onChange={handleChange}
              value={inputs.password}
              type="password"
              name="password"
              id="password"
            />
          </label>
          <button type="submit">Login</button>
        </fieldset>
      </form>
    </div>
  );
}

export default LoginPage;
