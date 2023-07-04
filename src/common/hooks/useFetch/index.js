import useLoading from "../useLoading";
import useLocalStorage from "../useLocalStorage";

const useFetch = (baseURL = "/api/schedules") => {
  const { update } = useLoading();
  const { get: gl } = useLocalStorage();

  const fech = async (endpoint, props, loading) => {
    const authToken = gl("x-auth-token");
    const { protocol, port, hostname } = window.location;
    const proto = `${protocol}//`;
    const por = port ? ":4999" : "";
    const path = `${baseURL}${endpoint || ""}`;
    const auth = "";
    // const auth = authToken ? `?auth=${authToken}` : "";
    const url = proto + hostname + por + path + auth;
    try {
      update(true, loading);
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
        json: { error: error.message, stack: error.stack, errorCode: 470 },
        raw: undefined,
      };
    } finally {
      update(false, loading);
    }
  };

  const fetchOb = (body, method) => ({
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const get = (endpoint, loading) => fech(endpoint, { method: "GET" }, loading);
  const post = (endpoint, body, loading) =>
    fech(endpoint, fetchOb(body, "POST"), loading);
  const patch = (endpoint, body, loading) =>
    fech(endpoint, fetchOb(body, "PATCH"), loading);
  const dlete = (endpoint, loading) =>
    fech(endpoint, { method: "DELETE" }, loading);

  return { get, post, dlete, patch };
};

export default useFetch;
