import useForm from "../hooks/useForm";

interface RegisterFormValues {
  username: string;
  password: string;
}

function RegisterPage(): JSX.Element {
  const { handleChange, inputs } = useForm<RegisterFormValues>({
    password: "",
    username: "",
  });

  return (
    <div>
      <h1>Register</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = await fetch("/api/register", {
            body: JSON.stringify(inputs),
            method: "POST",
          });
          const user = await data.json();
          console.log(user);
        }}
      >
        <fieldset>
          <label htmlFor="username">
            Username
            <input
              value={inputs.username}
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              value={inputs.password}
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
            />
          </label>
          <button type="submit">Register!</button>
        </fieldset>
      </form>
    </div>
  );
}

export default RegisterPage;
