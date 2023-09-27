const useFile = () => {
  const pickFile = (type = "*", multiple = false) =>
    new Promise((res, rej) => {
      const input = document.createElement("input");
      input.type = "file";
      input.hidden = true;
      input.accept = type;
      input.multiple = multiple;
      input.onchange = (e) => {
        res([].slice.call(e.target.files));
      };
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });

  return {
    pickFile,
  };
};

export default useFile;
