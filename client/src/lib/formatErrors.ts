import { ValidationError } from "yup";

export default function formatErrors<T>(errors: any[]): T {
  return errors.reduce(
    (acc: Record<string, string[]>, val: ValidationError) => {
      if (!Array.isArray(acc[val.path!])) {
        acc[val.path!] = [];
      }

      acc[val.path!].push(
        val.message.charAt(0).toUpperCase() + val.message.slice(1),
      );

      return acc;
    },
    {},
  );
}
