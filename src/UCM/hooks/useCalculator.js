import { _l, fix_percent, mitre_base_url } from "../utils/utils";

const useCalculator = (sheets) => {
  const calculate = (key) => {
    const { content } = sheets[key];
    if (key === "l1_uc") {
      const l2_uc_related = {};
      const l3_uc_related = {};
      const l4_uc_related = {};
      const effectiveness = {};
      const l2_uc_name = {};
      const l2_uc_identifiers = {};
      const coverage = {};
      const { avg_coverage, avg_effectiveness } = calculate("l2_uc");
      content.map((c) => {
        const _id = c._id.value;
        const l2s = [];
        const uc = c.identifier.value;
        const tactics = c.l2_uc_identifiers.value;

        const tacticNames = [];

        sheets.l2_uc.content
          .filter((d) => tactics.includes(d.identifier.value))
          .map((l2uc) => {
            tacticNames.push(l2uc.name.value);
            const l2id = l2uc.identifier.value;
            if (!l2s.includes(l2id)) l2s.push(l2id);
          });

        const l3s = sheets.l3_uc.content
          .filter((d) =>
            d.l2_uc_identifiers.value.some((l2) => l2s.includes(l2))
          )
          .map((d) => d.identifier.value);

        l3_uc_related[uc] = String(l3s.length);
        l3_uc_related[_id] = String(l3s.length);
        l2_uc_related[uc] = String(l2s.length);
        l2_uc_related[_id] = String(l2s.length);
        l2_uc_name[uc] = tacticNames.join(", ");
        l2_uc_name[_id] = tacticNames.join(", ");
        l2_uc_identifiers[uc] = tactics.join(", ");
        l2_uc_identifiers[_id] = tactics.join(", ");

        const l4s = sheets.l4_uc.content.filter((d) =>
          l3s.includes(d.l3_uc_identifier.value)
        );

        l4_uc_related[uc] = String(l4s.length);
        l4_uc_related[_id] = String(l4s.length);

        const av = (of) =>
          (l2s.length === 0
            ? 0
            : l2s.map((l2) => fix_percent(of[l2])).reduce((a, b) => a + b, 0) /
              l2s.length
          ).toFixed(2) + "%";

        coverage[uc] = av(avg_coverage);
        effectiveness[uc] = av(avg_effectiveness);
        coverage[_id] = coverage[uc];
        effectiveness[_id] = effectiveness[uc];
      });

      return {
        l3_uc_related,
        l4_uc_related,
        l2_uc_related,
        effectiveness,
        coverage,
        l2_uc_name,
        l2_uc_identifiers,
      };
    }

    if (key === "l2_uc") {
      const avg_effectiveness = {};
      const avg_coverage = {};
      const l1_uc_name = {};
      const l1_uc_identifiers = {};
      const l3_uc_related = {};
      const l4_uc_related = {};
      const mitre_url = {};
      const { coverage, effectiveness } = calculate("l3_uc");

      content.map((c) => {
        const _id = c._id.value;
        const uc = c.identifier.value;
        mitre_url[_id] = `${mitre_base_url}/tactics/${uc}`;
        const l1 = sheets.l1_uc.content.filter((_uc) =>
          _uc.l2_uc_identifiers.value.some((v) => _l(v) === _l(uc))
        );

        l1_uc_identifiers[uc] =
          l1.map((l) => l.identifier.value).join(", ") || "Unknown";
        l1_uc_name[uc] = l1.map((l) => l.name.value).join(", ") || "Unknown";

        l1_uc_identifiers[_id] = l1_uc_identifiers[uc];
        l1_uc_name[_id] = l1_uc_name[uc];

        const l3s = sheets.l3_uc.content
          .filter((d) => d.l2_uc_identifiers.value.includes(uc))
          .map((d) => d.identifier.value);

        l3_uc_related[uc] = String(l3s.length);
        l3_uc_related[_id] = String(l3s.length);

        const av = (of) =>
          (l3s.length === 0
            ? 0
            : l3s.map((l3) => fix_percent(of[l3])).reduce((a, b) => a + b, 0) /
              l3s.length
          ).toFixed(2) + "%";

        avg_coverage[uc] = av(coverage);
        avg_effectiveness[uc] = av(effectiveness);
        avg_coverage[_id] = avg_coverage[uc];
        avg_effectiveness[_id] = av(effectiveness);

        const l4s = sheets.l4_uc.content.filter((d) =>
          l3s.includes(d.l3_uc_identifier.value)
        );

        l4_uc_related[uc] = String(l4s.length);
        l4_uc_related[_id] = String(l4s.length);
      });

      return {
        l1_uc_identifiers,
        l1_uc_name,
        l3_uc_related,
        avg_effectiveness,
        avg_coverage,
        l4_uc_related,
        mitre_url,
      };
    }

    if (key === "l3_uc") {
      const effectiveness = {};
      const coverage = {};
      const l1_uc_name = {};
      const l1_uc_identifiers = {};
      const l4_uc_related = {};
      const l2_uc_identifiers = {};
      const mitre_url = {};

      content.map((c) => {
        const _id = c._id.value;
        const uc = c.identifier.value;
        const l2ids = c.l2_uc_identifiers.value;
        mitre_url[_id] = `${mitre_base_url}/techniques/${uc}`;

        const l2 = sheets.l2_uc.content.filter((l2uc) =>
          l2ids.includes(l2uc.identifier.value)
        );

        const l1 = sheets.l1_uc.content.filter((l1uc) =>
          l1uc.l2_uc_identifiers.value.some((t) => l2ids.includes(t))
        );

        l1_uc_identifiers[uc] =
          l1.map((l) => l.identifier.value).join(", ") || "Unknown";
        l1_uc_name[uc] = l1.map((l) => l.name.value).join(", ") || "Unknown";

        l1_uc_identifiers[_id] = l1_uc_identifiers[uc];
        l1_uc_name[_id] = l1_uc_name[uc];

        const l4s = sheets.l4_uc.content.filter(
          (d) => d.l3_uc_identifier.value === uc
        );

        const sum = (key) => {
          const _sum = [
            ...l4s.map((l4) => fix_percent(l4[key].value)),
            fix_percent(c[key].value),
          ].reduce((p, n) => p + n, 0);
          return (_sum / (l4s.length + 1)).toFixed(2) + "%";
        };

        l4_uc_related[uc] = String(l4s.length);
        l4_uc_related[_id] = String(l4s.length);

        l2_uc_identifiers[uc] =
          l2.map((l) => _l(l.name.value).split(" ").join("-")).join(", ") ||
          "Unknown";
        l2_uc_identifiers[_id] = l2_uc_identifiers[uc];
        coverage[uc] = sum("coverage");
        effectiveness[uc] = sum("effectiveness");
        coverage[_id] = coverage[uc];
        effectiveness[_id] = effectiveness[uc];
      });

      return {
        coverage,
        effectiveness,
        l1_uc_name,
        l1_uc_identifiers,
        l4_uc_related,
        l2_uc_identifiers,
        mitre_url,
      };
    }

    if (key === "l4_uc") {
      const effectiveness = {};
      const coverage = {};
      const l1_uc_name = {};
      const l1_uc_identifiers = {};
      const l2_uc_identifiers = {};
      const mitre_url = {};

      content.map((c) => {
        const uc = c.identifier.value;
        const _id = c._id.value;
        const l3id = c.l3_uc_identifier.value;
        mitre_url[_id] = `${mitre_base_url}/techniques/${uc
          .split(".")
          .join("/")}`;

        const l3 = sheets.l3_uc.content.find(
          (l3uc) => l3uc.identifier.value === l3id
        );
        if (!l3) return;

        const l2ids = l3.l2_uc_identifiers.value;

        const l2 = sheets.l2_uc.content.filter((l2uc) =>
          l2ids.includes(l2uc.identifier.value)
        );

        const l1 = sheets.l1_uc.content.filter((l1uc) =>
          l1uc.l2_uc_identifiers.value.some((t) => l2ids.includes(t))
        );

        l1_uc_identifiers[uc] =
          l1.map((l) => l.identifier.value).join(", ") || "Unknown";
        l1_uc_name[uc] = l1.map((l) => l.name.value).join(", ") || "Unknown";

        l1_uc_identifiers[_id] = l1_uc_identifiers[uc];
        l1_uc_name[_id] = l1_uc_name[uc];

        l2_uc_identifiers[uc] =
          l2.map((l) => _l(l.name.value).split(" ").join("-")).join(", ") ||
          "Unknown";
        l2_uc_identifiers[_id] = l2_uc_identifiers[uc];

        coverage[uc] = fix_percent(c.coverage.value) + "%";
        effectiveness[uc] = fix_percent(c.effectiveness.value) + "%";

        coverage[_id] = coverage[uc];
        effectiveness[_id] = effectiveness[uc];
      });

      return {
        coverage,
        l2_uc_identifiers,
        effectiveness,
        l1_uc_name,
        l1_uc_identifiers,
        mitre_url,
      };
    }

    if (key === "dev_uc") {
      const l1_uc_identifiers = {};
      const l2_uc_identifiers = {};
      const l3_uc_name = {};
      const l4_uc_identifier = {};
      const l4_uc_name = {};
      const l2_uc_name = {};
      const car_uc_names = {};
      const car_uc_identifiers = {};

      const { l1_uc_identifiers: l1uci, l2_uc_identifiers: l2i } =
        calculate("l3_uc");

      content.map((c) => {
        const _id = c._id.value;
        const l3id = c.l3_uc_identifier.value;
        const l4id = c.l4_uc_identifier.value;
        const cars = c.car_uc_identifiers.value;

        l1_uc_identifiers[_id] = l1uci[l3id];
        l2_uc_name[_id] = l2i[l3id];
        l2_uc_identifiers[_id] = l2i[l3id];
        l4_uc_identifier[_id] = l4id || "(N/A - technique only)";

        const l3 = sheets.l3_uc.content.find(
          (l3uc) => l3uc.identifier.value === l3id
        );

        if (l3) l3_uc_name[_id] = l3.name.value;

        const l4 = sheets.l4_uc.content.find(
          (l4uc) => l4uc.identifier.value === l4id
        );
        l4_uc_name[_id] = l4?.name?.value || "(N/A - technique only)";

        const car_uc = sheets.car_uc.content.filter((l2uc) =>
          cars.includes(l2uc.identifier.value)
        );

        if (car_uc)
          car_uc_names[_id] = car_uc.map((c) => c.name.value).join(", ");

        car_uc_identifiers[_id] = cars.join(", ");
      });

      return {
        l2_uc_identifiers,
        car_uc_identifiers,
        l1_uc_identifiers,
        l4_uc_identifier,
        car_uc_names,
        l2_uc_name,
        l3_uc_name,
        l4_uc_name,
      };
    }

    if (key === "db_uc") {
      const l1_uc_identifiers = {};

      content.map((c) => {
        l1_uc_identifiers[c._id.value] = c.l1_uc_identifiers.value.join(", ");
      });

      return {
        l1_uc_identifiers,
      };
    }
    if (key === "car_uc") {
      const mitre_url = {};
      const application_platforms = {};

      content.map((c) => {
        const _id = c._id.value;
        const id = c.identifier.value;
        const ap = c.application_platforms.value;
        application_platforms[_id] = ap.join(", ");
        mitre_url[_id] = "https://car.mitre.org/analytics/" + id;
      });

      return { mitre_url, application_platforms };
    }
    return {};
  };

  return calculate;
};

export default useCalculator;
