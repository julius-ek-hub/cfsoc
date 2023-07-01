import useActiveSchedule from "../useSchedules/active";

const useSelection = () => {
  const { active } = useActiveSchedule();
  const tbody = () => document.querySelector("#tbody-selectable");
  const children = () => [].slice.call(tbody().querySelectorAll(".selectable"));

  const getSelected = () => {
    return children()
      .filter((td) => td.classList.contains("selected"))
      .map((td) => {
        return {
          staff: td.getAttribute("staff"),
          dateIndex: Number(td.getAttribute("date_index")),
        };
      });
  };
  const lc = (td) => td.firstElementChild.lastElementChild;

  const selectTarget = (td) => {
    lc(td).style.display = "flex";
    td.classList.add("selected", "true");
  };
  const unselectTarget = (td) => {
    lc(td).style.display = "none";
    td.classList.remove("selected");
  };

  const unselectAll = () => children().map(unselectTarget);

  const init = () => {
    try {
      const tb = tbody();
      let xs, xe, ys, ye;

      const handleSelection = (e) => {
        if (e.button !== 0 || active.locked) return;
        xe = e.clientX;
        ye = e.clientY;
        children().map((td) => {
          const { x, y, bottom, right } = td.getBoundingClientRect();
          const plus_x_plus_y =
            xe >= xs &&
            ye >= ys &&
            xe > x &&
            right > xs &&
            ye > y &&
            bottom > ys;
          const plus_x_minus_y =
            xe >= xs &&
            ye <= ys &&
            xe > x &&
            right > xs &&
            ye < bottom &&
            ys > y;
          const minus_x_minus_y =
            xe <= xs &&
            ye <= ys &&
            xe < right &&
            xs > x &&
            ye < bottom &&
            ys > y;
          const minus_x_plus_y =
            xe <= xs &&
            ye >= ys &&
            xe < right &&
            xs > x &&
            ye > y &&
            bottom > ys;
          if (
            plus_x_plus_y ||
            plus_x_minus_y ||
            minus_x_minus_y ||
            minus_x_plus_y
          ) {
            selectTarget(td);
          } else {
            unselectTarget(td);
          }
        });
      };
      tb.onmousedown = (e) => {
        if (e.button !== 0 || active.locked) return;
        unselectAll();
        xs = e.clientX;
        ys = e.clientY;
        tb.onmousemove = (e) => {
          if (!xs || !ys) return;
          handleSelection(e);
        };
        tb.onmouseup = (e) => {
          handleSelection(e);
          xs = undefined;
          ys = undefined;
        };
      };
    } catch (error) {}
  };

  return { init, getSelected, unselectAll, selectTarget };
};

export default useSelection;
