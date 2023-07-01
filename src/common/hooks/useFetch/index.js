import useLoading from "../useLoading";

const useFetch = () => {
  const { update } = useLoading();

  const fech = async (endpoint, props, loading) => {
    const { protocol, port, hostname } = window.location;
    try {
      update(true, loading);
      const raw = await fetch(
        `${protocol}//${hostname + (port ? ":4999" : "")}/api/schedules/${
          endpoint || ""
        }`,
        props
      );
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
  const post = (endpoint, body) => fech(endpoint, fetchOb(body, "POST"));
  const patch = (endpoint, body) => fech(endpoint, fetchOb(body, "PATCH"));
  const dlete = (endpoint) =>
    fech(endpoint, {
      method: "DELETE",
    });

  return { get, post, dlete, patch };
};

export default useFetch;
