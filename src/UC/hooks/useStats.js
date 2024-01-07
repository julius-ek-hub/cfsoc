import { _entr, _l, arrMust, entr_, u_arr } from "../../common/utils/utils";
import useSettings from "./useSettings";

import useSheet from "./useSheet";

const useStats = () => {
  const { contents } = useSheet();

  const { settings } = useSettings();

  const stats = {
    l1_uc: {
      key: "l1_uc_identifiers",
      required: {
        l2_uc_related: "l2_uc_identifiers",
        l3_uc_related: "l3_uc_identifiers",
        l4_uc_related: "l4_uc_identifiers",
      },
      sub: { key: "l2s", l: "l2_uc" },
    },
    l2_uc: {
      key: "l2_uc_identifiers",
      required: {
        l3_uc_related: "l3_uc_identifiers",
        l4_uc_related: "l4_uc_identifiers",
      },
      sub: { key: "l3s", l: "l3_uc" },
    },
    l3_uc: {
      key: "l3_uc_identifiers",
      required: {
        l4_uc_related: "l4_uc_identifiers",
      },
      sub: { key: "l4s", l: "l4_uc" },
    },
    l4_uc: {
      key: "l4_uc_identifiers",
      required: {},
    },
  };

  const get = (uc_id, identifier, exclude = {}) => {
    const stat = stats[uc_id];

    const filterFn = (uc) =>
      arrMust(uc[stat.key]?.value || []).includes(identifier);

    if (!stat) return {};

    let sub = {};

    const subInfo = stat.sub;

    if (subInfo && !exclude.sub)
      sub = { [subInfo.key]: contents[subInfo.l].filter(filterFn) };

    const auc = contents.all_uc.filter(filterFn);

    return {
      uc_count: { value: auc.length },
      uc: auc,
      ...sub,
      ...(!exclude.related &&
        entr_(
          _entr(stat.required).map(([k, v]) => [
            k,
            {
              value: auc.filter((uc) => arrMust(uc[v]?.value || []).length > 0)
                .length,
            },
          ])
        )),
    };
  };

  const mainfilterFn = (key, value) =>
    contents.all_uc.filter((uc) => _l(uc[key]?.value) === _l(value)).length;

  const sourceStats = () => {
    const sc = (settings.uc_filter || {}).find((s) => s.key == "source");
    if (!sc) return [];

    return sc.options.map((opton) => [
      opton || "Blanc",
      mainfilterFn("source", opton),
    ]);
  };

  const techStats = () => {
    const sc = (settings.uc_filter || {}).find((s) => s.key == "technology");
    if (!sc) return [];

    return sc.options.map((opton) => [
      opton || "Blanc",
      mainfilterFn("technology", opton),
    ]);
  };

  const cusStats = () => {
    const sc = (settings.uc_filter || {}).find((s) => s.key == "customer");
    if (!sc) return [];

    return sc.options.map((opton) => [
      opton || "Blanc",
      mainfilterFn("customer", opton),
    ]);
  };

  return { get, sourceStats, cusStats, techStats };
};
export default useStats;
