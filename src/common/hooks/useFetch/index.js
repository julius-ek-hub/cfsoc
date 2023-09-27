import useLoading from "../useLoading";
import useLocalStorage from "../useLocalStorage";

const useFetch = (baseURL = "/api/schedules") => {
  const { update } = useLoading();
  const { get: gl } = useLocalStorage();

  const serverURL = (path = "") => {
    const { protocol, port, hostname } = window.location;
    const proto = `${protocol}//`;
    const por = port ? `:${4999}` : "";
    return proto + hostname + por + path;
  };

  const fech = async (endpoint, props, loading) => {
    const authToken = gl("x-auth-token");
    const url = serverURL(baseURL + (endpoint || ""));
    try {
      loading !== "no" && update(true, loading);
      const raw = await fetch(url, {
        ...props,
        headers: {
          ...props.headers,
          "x-auth-token": authToken,
        },
      });
      const json = await raw.json();
      return { json, raw };
    } catch (error) {
      return {
        json: {
          error: "Something went wrong",
          stack: error.stack,
          errorCode: 470,
        },
        raw: undefined,
      };
    } finally {
      loading !== "no" && update(false, loading);
    }
  };

  const fetchOb = (body, method, file) => ({
    method,
    ...(file
      ? { body }
      : {
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }),
  });

  const get = (endpoint, loading) => fech(endpoint, { method: "GET" }, loading);
  const post = (endpoint, body, loading, file) =>
    fech(endpoint, fetchOb(body, "POST", file), loading);
  const patch = (endpoint, body, loading) =>
    fech(endpoint, fetchOb(body, "PATCH"), loading);
  const dlete = (endpoint, loading) =>
    fech(endpoint, { method: "DELETE" }, loading);

  return { get, post, dlete, patch, serverURL };
};

export default useFetch;
